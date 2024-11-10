import { NextFunction, Response, Request } from 'express';
import { Redis } from 'ioredis';
import { AxiosResponse } from 'axios';
import { DetailedUser as AuthDetailedUser, TenantSelect } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/schemas-dashboard/types';
import { BadRequestError, UnauthenticatedError } from '@trg_package/errors';
import {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService,
  PermissionActionService,
  UserTallyCompanyService,
  ApiKeyService
} from '@trg_package/schemas-dashboard/services';
import {
  TableService,
  ColumnService,
  ReportService
} from '@trg_package/schemas-reporting/services';
import { CompanyService } from '@trg_package/schemas-tally/services';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';
import { createClient, createUrl } from '@/models';
import { authAxios } from '@/utils/authAxios';
import * as dashboardSchemas from '@/models/schemas';
import config from '@/config';

const { REDIS_PORT, REDIS_HOST } = config;

interface CachedUser {
  user: AuthDetailedUser & DashDetailedUser;
}

export interface DashboardDatabase {
  client: PostgresJsDatabase<typeof dashboardSchemas>
  connection: Sql<{}>
}

export interface DashboardServices {
  user: UserService;
  role: RoleService;
  module: ModuleService;
  action: ActionService;
  permission: PermissionService;
  permissionAction: PermissionActionService;
  userTallyCompany: UserTallyCompanyService;
  apiKey: ApiKeyService;
  company: CompanyService;
  table: TableService;
  column: ColumnService;
  report: ReportService;
}

export class Initialization {
  private static redis: Redis;

  public static initialize = () => {
    Initialization.redis = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  };

  public static async attachUser(req: Request, res: Response, next: NextFunction) {
    try {
      const connectSID = req.cookies['connect.sid'];

      if (!connectSID) {
        throw new UnauthenticatedError('No cookie found');
      }

      const cacheKey = `user:${connectSID}`;
      const cachedUser = await Initialization.getFromCache<CachedUser>(cacheKey);

      if (cachedUser) {
        const { user } = cachedUser;
        req.user = user;
        const database = await Initialization.initDatabase(user.tenant.id, user.tenant);
        const services = await Initialization.initServices(database);

        req.dashboard = { database, services };
        return next();
      }

      const authResponse: AxiosResponse<{
        user: AuthDetailedUser & DashDetailedUser;
        isAuthenticated: boolean;
      }> = await authAxios.get('/api/v1/auth/status', {
        headers: { cookie: req.headers.cookie },
        timeout: 1000 * 60
      });

      const { user, isAuthenticated } = authResponse.data;

      if (!isAuthenticated || !user.tenant_id) {
        throw new UnauthenticatedError('User not found or unauthorized');
      }

      req.user = user;

      await Initialization.setCache(
        cacheKey,
        user,
        req.session?.cookie?.expires?.getTime()
      );

      const database = await Initialization.initDatabase(req.user.tenant.id, req.user.tenant);
      const services = await Initialization.initServices(database);

      req.dashboard = { database, services };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  private static async initDatabase(tenantId: TenantSelect['id'], {
    db_name,
    db_username,
    db_password
  }: TenantSelect): Promise<DashboardDatabase> {
    if (!db_name || !db_username || !db_password) {
      throw new BadRequestError('Tenant database error, missing credentials');
    }

    const DASHBOARD_PG_URL = createUrl({
      db_username,
      db_password,
      db_name
    });

    const { client, connection } = createClient(
      `TENANT:${tenantId}`,
      DASHBOARD_PG_URL,
      dashboardSchemas,
      {
        DB_MIGRATING: false,
        DB_SEEDING: false
      }
    );

    return {
      client,
      connection
    };
  }

  private static async initServices(database: DashboardDatabase): Promise<DashboardServices> {
    const services: DashboardServices = {
      user: new UserService(database.client),
      role: new RoleService(database.client),
      module: new ModuleService(database.client),
      action: new ActionService(database.client),
      permission: new PermissionService(database.client),
      permissionAction: new PermissionActionService(database.client),
      userTallyCompany: new UserTallyCompanyService(database.client),
      apiKey: new ApiKeyService(database.client),
      company: new CompanyService(database.client as any),
      table: new TableService(database.client),
      column: new ColumnService(database.client),
      report: new ReportService(database.client),
    };

    return services;
  }

  private static async getFromCache<T>(key: string): Promise<T | null> {
    try {
      const cached = await Initialization.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache retrieval failed:', error);
      return null;
    }
  }

  private static async setCache<T>(
    key: string,
    data: T,
    ttl: number | undefined
  ): Promise<void> {
    try {
      await Initialization.redis.setex(
        key,
        ttl ? Math.round((ttl - Date.now()) / 1000) : 60 * 60,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Cache setting failed:', error);
    }
  }

  public static async clearCache(options: {
    cookie?: string;
    tenantId?: string;
    type?: 'user' | 'database' | 'services' | 'all'
  }): Promise<void> {
    const { cookie, tenantId, type = 'all' } = options;

    if (type === 'all') {
      if (cookie) await Initialization.redis.del(`user:${cookie}`);
      if (tenantId) {
        await Promise.all([
          Initialization.redis.del(`pgdashboard:${tenantId}`),
          Initialization.redis.del(`services:${tenantId}`)
        ]);
      }
      return;
    }

    if (type === 'user' && cookie) {
      await Initialization.redis.del(`user:${cookie}`);
    } else if (tenantId) {
      await Initialization.redis.del(`${type}:${tenantId}`);
    }
  }
}
