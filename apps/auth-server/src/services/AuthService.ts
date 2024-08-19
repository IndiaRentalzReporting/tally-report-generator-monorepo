import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { BadRequestError, NotFoundError } from '@trg_package/errors';
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

    const { password, ...user } = await UserService.createOne({
      ...userData,
      password: await this.hashPassword(userData.password)
    });
    const tenant = await TenantService.onboard(tenantData, userData);

    return { user, tenant };
  }

  public static async signIn(
    data: Pick<UserInsert, 'email' | 'password'>
  ): Promise<UserSelect> {
    const { email, password } = data;
    const user = await UserService.findOne({
      email
    });

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    await this.comparePassword(password, user.password);

    return user;
  }

  public static async changePassword(
    data: Pick<UserInsert, 'email'> & {
      password: string;
    }
  ): Promise<Omit<UserSelect, 'password'>> {
    const { email, password: pw } = data;
    const { password, ...user } = await UserService.updateOne(email, {
      password: pw
    });

    if (user === undefined) {
      throw new NotFoundError('User does not exist');
    }

    return user;
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  static async comparePassword(password: string, hash: string): Promise<void> {
    const doesPasswordMatch = await bcrypt.compare(password, hash);
    if (!doesPasswordMatch) {
      throw new BadRequestError('Wrong Password');
    }
  }

  static async generateTempPassword(length: number): Promise<string> {
    return randomBytes(length).toString('hex').slice(0, length);
  }
}

export default AuthService;
