import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { BadRequestError, NotFoundError } from '@trg_package/errors';
import { comparePassword } from '@trg_package/utils';
import {
  SafeUserSelect,
  TenantInsert,
  TenantSelect,
  UserInsert,
  UserSelect
} from '@trg_package/auth-schemas/types';
import UserService from './UserService';
import TenantService from './TenantService';

class AuthService {
  public static async signUp(data: {
    user: UserInsert;
    tenant: TenantInsert;
  }): Promise<{ user: SafeUserSelect; tenant: TenantSelect }> {
    const { user: userData, tenant: tenantData } = data;

    const existingUser = await UserService.findOne({
      email: userData.email
    }).catch((e) => {
      if (e instanceof NotFoundError) return null;
      throw e;
    });

    if (existingUser) {
      throw new BadRequestError('User Already Exists');
    }

    const existingTenant = await TenantService.findOne({
      name: tenantData.name
    }).catch((e) => {
      if (e instanceof NotFoundError) return null;
      throw e;
    });

    if (existingTenant) {
      throw new BadRequestError('Tenant Already Exists');
    }

    const tenant = await TenantService.onboard(tenantData, userData);
    const { password, ...user } = await UserService.createOne({
      ...userData,
      tenant_id: tenant.id
    });

    return { user, tenant };
  }

  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<UserSelect> {
    const { email, password } = data;
    const user = await UserService.findOne({
      email
    });

    await comparePassword(password, user.password);

    return user;
  }

  public static async changePassword(
    data: Pick<UserInsert, 'email'> & {
      password: string;
    }
  ): Promise<SafeUserSelect> {
    const { email, password: pw } = data;
    const { password, ...user } = await UserService.updateOne(email, {
      password: pw
    });

    if (user === undefined) {
      throw new NotFoundError('User does not exist');
    }

    return user;
  }

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}

export default AuthService;
