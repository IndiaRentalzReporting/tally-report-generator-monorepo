import { randomBytes } from 'crypto';
import { BadRequestError, CustomError, ReadError } from '@trg_package/errors';
import {
  TenantInsert,
  TenantSelect,
  UserSelect
} from '@trg_package/schemas-auth/types';
import { UserSelect as DashboardUserSelect } from '@trg_package/schemas-dashboard/types';
import UserService from './user.service';
import TenantService from './tenant.service';
import { RegisterUser } from '@/types/user';
import DashboardService from './dashboard.service';
import { migrateDashboardSchema } from '@/models/dashboard/seed/migrate';

class AuthService {
  public static async onboard(data: {
    user: RegisterUser;
    tenant: TenantInsert;
  }): Promise<{ user: UserSelect; tenant: TenantSelect }> {
    const {
      user: userData, tenant: tenantData
    } = data;

    const existingUser = await UserService.findOne({
      email: userData.email
    }).catch((e) => {
      if (e instanceof ReadError) return null;
      throw e;
    });

    if (existingUser) {
      throw new BadRequestError('User Already Exists');
    }

    const existingTenant = await TenantService.findOne({
      name: tenantData.name
    }).catch((e) => {
      if (e instanceof ReadError) return null;
      throw e;
    });

    if (existingTenant) {
      throw new BadRequestError('Tenant Already Exists');
    }

    const tenant = await TenantService.createOne(tenantData);
    const {
      id: tenant_id, db_name, db_password, db_username
    } = tenant;

    if (!db_name || !db_password || !db_username) {
      throw new CustomError('Tenant credentials incomplete', 500);
    }

    const DSI = new DashboardService({
      db_username, db_password, db_name
    });

    migrateDashboardSchema(DSI.URL);
    const { id: role_id } = await DSI.seedRole();
    const user = await UserService.createOne({
      ...userData,
      tenant_id,
      role_id
    }).then(async (user) => {
      await DSI.seed();
      return user;
    }).finally(async () => DSI.terminateConnection());

    return {
      user,
      tenant
    };
  }

  public static async signUp(
    tenant: TenantSelect,
    data: RegisterUser & { role_id?: DashboardUserSelect['role_id'] }
  ): Promise<UserSelect> {
    return UserService.createOne({
      ...data,
      tenant_id: tenant.id,
      status: 'inactive'
    });
  }

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}

export default AuthService;
