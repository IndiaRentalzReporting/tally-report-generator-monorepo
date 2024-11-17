import { UserService as BaseUserService } from '@trg_package/schemas-auth/services';
import { UserService as DashboardUserService } from '@trg_package/schemas-dashboard/services';
import { DetailedUser as AuthDetailedUser, UserSelect } from '@trg_package/schemas-auth/types';
import { BadRequestError, CustomError } from '@trg_package/errors';
import { DetailedUser as DashDetailedUser } from '@trg_package/schemas-dashboard/types';
import jwt from 'jsonwebtoken';
import { createUrl, createClient } from '@/models';
import TenantService from './TenantService';
import { authDb } from '../models/auth/index';
import * as dashboardSchemas from '../models/dashboard/schema';
import config from '@/config';

class UserService extends BaseUserService {
  constructor() {
    super(authDb);
  }

  public async findOne(
    data: Partial<AuthDetailedUser>
  ): Promise<AuthDetailedUser & DashDetailedUser> {
    const user = (await super.findOne(data, {
      with: {
        tenant: true
      }
    })) as AuthDetailedUser & DashDetailedUser;
    if (!!data.tenant_id && !!data.email) {
      const { email, tenant_id } = data;
      const { db_name, db_username, db_password } = await TenantService.findOne(
        { id: tenant_id }
      );

      if (!db_name || !db_username || !db_password) {
        throw new BadRequestError('Tenant database error, missing credentials');
      }

      const DASHBOARD_PG_URL = createUrl({
        db_username,
        db_password,
        db_name
      });

      const { client: dashboardDb, connection: dashboardConnection } = createClient(
        DASHBOARD_PG_URL,
        dashboardSchemas,
        {
          DB_MIGRATING: false,
          DB_SEEDING: false
        }
      );

      const USI = new DashboardUserService(dashboardDb);
      const {
        role_id, role
      } = await USI.findOne({ email });

      dashboardConnection.end();

      user.role_id = role_id;
      user.role = role;
    }
    return user;
  }

  public async createJwtToken(id: UserSelect['id']): Promise<string> {
    try {
      const { SMTP_SECRET } = config;

      return jwt.sign(
        { id },
        SMTP_SECRET,
        { expiresIn: '15m' }
      );
    } catch (error) {
      throw new CustomError('Could not create jwt token', 500);
    }
  }

  public async verifyJwtToken(token: string): Promise<UserSelect> {
    try {
      const { SMTP_SECRET } = config;
      const { id } = jwt.verify(token, SMTP_SECRET) as jwt.JwtPayload;

      return this.findOne({ id });
    } catch (error) {
      throw new BadRequestError('Invalid reset password token');
    }
  }
}

const USI = new UserService();

export default USI;
