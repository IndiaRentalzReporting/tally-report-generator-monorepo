import TenantService from '../services/TenantService';
import { BadRequestError } from '@trg_package/errors';
import { NextFunction, Response, Request } from 'express';
import { createDashboardClient } from '../models';
import * as dashboardSchemas from '@trg_package/dashboard-schemas/schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

declare global {
  namespace Express {
    interface Request {
      dashboardDb: PostgresJsDatabase<typeof dashboardSchemas>;
      dashboardConnection: postgres.Sql<{}>;
    }
  }
}

export const attachPGDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user.tenant_id) {
    const { tenant_id } = req.user;

    const { db_name, db_username, db_password } = await TenantService.findOne({
      id: tenant_id
    });

    if (!db_name || !db_username || !db_password) {
      throw new BadRequestError('Tenant database error, missing credentials');
    }

    const { client: dashboardDb, connection: dashboardConnection } =
      createDashboardClient({
        db_username,
        db_password,
        db_name
      });

    req.dashboardDb = dashboardDb;
    req.dashboardConnection = dashboardConnection;
  }

  next();
};
