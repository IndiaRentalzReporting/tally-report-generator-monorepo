import { UserService as BaseUserService } from '@trg_package/auth-schemas/services';
import { UserService as DashboardUserService } from '@trg_package/dashboard-schemas/services';
import { authDb } from '../models/auth/index';
import { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import TenantService from './TenantService';
import { BadRequestError } from '@trg_package/errors';
import { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';
import { createUrl, createClient } from '@trg_package/create-pg-client';
import * as dashboardSchemas from '../models/dashboard/schema';


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
      const { client: dashboardDb, connection: dashboardConnection } =
        createClient(DASHBOARD_PG_URL, dashboardSchemas, {
          DB_MIGRATING: false,
          DB_SEEDING: false
        });

      const USI = new DashboardUserService(dashboardDb);
      const { role_id, role } = await USI.findOneDetailedUser({ email });

      dashboardConnection.end();
      user.role_id = role_id;
      user.role = role;
    }
    return user;
  }
}

const USI = new UserService();

export default USI;
