import { randomBytes } from 'crypto';
import { BadRequestError, CustomError, ReadError } from '@trg_package/errors';
import {
  TenantInsert,
  TenantSelect,
  UserSelect
} from '@trg_package/schemas-auth/types';
import { RegisterUser, UserSelect as DetailedUser } from '@/types/user';
import UserService from './user.service';
import TenantService from './tenant.service';
import DashboardService from './dashboard.service';

class AuthService {
  public static async onboard(data: {
    user: RegisterUser;
    tenant: TenantInsert;
  }): Promise<{
      user: UserSelect;
      tenant: TenantSelect
    }> {
    const {
      user: userData,
      tenant: tenantData
    } = data;

    const existingUser = await this.checkIfExists('user', userData);
    if (existingUser) {
      throw new BadRequestError('User Already Exists');
    }
    const existingTenant = await this.checkIfExists('tenant', tenantData);
    if (existingTenant) {
      throw new BadRequestError('Tenant Already Exists');
    }

    const tenant = await TenantService.createOne(tenantData);
    const {
      id: tenant_id,
      db_name,
      db_password,
      db_username
    } = tenant;

    if (!db_name || !db_password || !db_username) {
      throw new CustomError('Tenant credentials incomplete', 500);
    }

    const DSI = new DashboardService({
      db_username,
      db_password,
      db_name
    });

    const user = await DSI
      .migrateAndSeedRole()
      .then(async (role_id) => {
        const user = await UserService.createOneWithTenant({
          ...userData,
          role_id
        }, tenant_id);
        await DSI.seed();
        return user;
      })
      .finally(async () => DSI.terminateConnection());

    return {
      user,
      tenant
    };
  }

  public static async createTeam(data: {
    user: DetailedUser;
    tenant: TenantInsert;
  }): Promise<{
      user: UserSelect;
      tenant: TenantSelect
    }> {
    const {
      user: userData,
      tenant: tenantData
    } = data;

    const existingTenant = await this.checkIfExists('tenant', tenantData);
    if (existingTenant) {
      throw new BadRequestError('Tenant Already Exists');
    }

    const tenant = await TenantService.createOne(tenantData);
    const {
      id: tenant_id,
      db_name,
      db_password,
      db_username
    } = tenant;

    if (!db_name || !db_password || !db_username) {
      throw new CustomError('Tenant credentials incomplete', 500);
    }

    const DSI = new DashboardService({
      db_username, db_password, db_name
    });

    const user = await DSI
      .migrateAndSeedRole()
      .then(async (role_id) => {
        const user = await UserService.createOneWithTenant({
          ...userData,
          role_id
        }, tenant_id);
        await DSI.seed();
        return user;
      })
      .finally(async () => DSI.terminateConnection());

    return {
      user,
      tenant
    };
  }

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  public static async checkIfExists<T extends 'user' | 'tenant'>(
    type: T,
    data: T extends 'user' ? Pick<UserSelect, 'email'> : Pick<TenantSelect, 'name'>
  ): Promise<boolean> {
    if (type === 'user' && 'email' in data) {
      return UserService.findOne(data)
        .then((user) => !!user)
        .catch((e) => {
          if (e instanceof ReadError) return false;
          throw e;
        });
    } if (type === 'tenant' && 'name' in data) {
      return TenantService.findOne(data)
        .then((tenant) => !!tenant)
        .catch((e) => {
          if (e instanceof ReadError) return false;
          throw e;
        });
    }
    throw new BadRequestError('Invalid type or data');
  }
}

export default AuthService;
