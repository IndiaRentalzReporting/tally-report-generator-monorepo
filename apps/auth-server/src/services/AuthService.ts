import { randomBytes } from 'crypto';
import { BadRequestError, CustomError, ReadError } from '@trg_package/errors';
import bcrypt from 'bcrypt';
import {
  TenantInsert,
  TenantSelect,
  UserInsert
} from '@trg_package/schemas-auth/types';
import { Request } from 'express';
import { UserSelect as DashboardUserSelect } from '@trg_package/schemas-dashboard/types';
import UserService from './UserService';
import TenantService from './TenantService';
import { RegisterUser } from '@/types/user';
import DashboardService from './DashboardService';

class AuthService {
  public static async onboard(data: {
    user: RegisterUser;
    tenant: TenantInsert;
  }): Promise<{ user: DashboardUserSelect; tenant: TenantSelect }> {
    const {
      user: {
        email, password, first_name, last_name
      }, tenant: tenantData
    } = data;

    const existingUser = await UserService.findOne({
      email
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

    const user = await DSI.migrateAndSeed({
      first_name,
      last_name
    });

    await DSI.terminateConnection();

    await UserService.createOne({
      id: user.id,
      password,
      email,
      tenant_id
    });

    return {
      user,
      tenant
    };
  }

  public static async signUp(
    tenant: TenantSelect,
    data: Omit<RegisterUser, 'password'>
  ): Promise<DashboardUserSelect> {
    const { email, first_name, last_name } = data;

    const { db_name, db_username, db_password } = tenant;
    if (!db_username || !db_password || !db_name) {
      throw new BadRequestError('Invalid Tenant');
    }

    const DSI = new DashboardService({ db_username, db_password, db_name });
    const dashboardUser = await DSI.createUser({
      first_name,
      last_name,
      status: 'inactive'
    });
    await DSI.terminateConnection();

    const tempPassword = await this.generateTempPassword(24);

    await UserService.createOne({
      id: dashboardUser.id,
      email,
      password: tempPassword,
      tenant_id: tenant.id
    });

    return dashboardUser;
  }

  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<Request['user']> {
    const { email, password } = data;
    const user = await UserService.findOne({
      email
    });

    const doesPasswordMatch = await bcrypt.compare(password, user.password);
    if (!doesPasswordMatch) {
      throw new BadRequestError('Wrong Password');
    }

    return user;
  }

  /* public static async changePassword(
    data: Pick<UserInsert, 'email'> & {
      password: string;
    }
  ): Promise<SafeUserSelect> {
    const { email, password: pw } = data;
    const { password, ...user } = await UserService.updateOne(
      { email },
      {
        password: pw
      }
    );

    return user;
  } */

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}

export default AuthService;
