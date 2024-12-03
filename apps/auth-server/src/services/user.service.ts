import { UserService as BaseUserService } from '@trg_package/schemas-auth/services';
import {
  DetailedUser as AuthDetailedUser,
  UserInsertSchema as AuthUserInsertSchema,
  UserSelect as AuthUserSelect,
  TenantSelect
} from '@trg_package/schemas-auth/types';
import {
  UserInsertSchema as DashboardUserInsertSchema
} from '@trg_package/schemas-dashboard/types';
import { BadRequestError, CreateError, CustomError } from '@trg_package/errors';
import jwt from 'jsonwebtoken';
import TenantService from './tenant.service';
import { authDb } from '../models/auth/index';
import config from '../config';
import DashboardService from './dashboard.service';
import UserTenantService from './user_tenant.service';
import { UserInsert, UserSelect } from '../types/user';

class UserService extends BaseUserService {
  constructor() {
    super(authDb);
  }

  public async findOne(
    data: Partial<AuthUserSelect>
  ): Promise<AuthDetailedUser> {
    const authUser = await super.findOne(data);

    return authUser;
  }

  public async createOneWithTenant(
    data: UserInsert,
    tenant_id: TenantSelect['id']
  ): Promise<AuthUserSelect> {
    const authUserData = AuthUserInsertSchema.parse(data);
    const dashboardUserData = DashboardUserInsertSchema.parse(data);

    const authUser = await super
      .createOne(authUserData)
      .catch((e) => {
        if (e instanceof CreateError) {
          const user = super.findOne({ email: authUserData.email });
          return user;
        }
        throw e;
      });

    const { db_name, db_username, db_password } = await TenantService.findOne({
      id: tenant_id
    });

    if (!db_name || !db_username || !db_password) {
      throw new BadRequestError('Tenant database error, missing credentials');
    }

    const DSI = new DashboardService({
      db_username,
      db_password,
      db_name
    });

    await DSI.createUser({
      id: authUser.id,
      ...dashboardUserData
    });
    await DSI.terminateConnection();

    await UserTenantService.createOne({
      user_id: authUser.id,
      tenant_id
    });

    return authUser;
  }

  public async updateOneWithTenant(
    filterDate: Partial<AuthUserSelect>,
    data: Partial<UserSelect>,
    tenant_id: TenantSelect['id']
  ): Promise<AuthUserSelect> {
    const authUserData = AuthUserInsertSchema.partial().safeParse(data);
    const dashboardUserData = DashboardUserInsertSchema.partial().safeParse(data);

    if (!authUserData.success) {
      throw new BadRequestError('Could not find user in auth database');
    }
    const authUser = await super.updateOne(filterDate, authUserData.data);

    if (dashboardUserData.success) {
      const { db_name, db_username, db_password } = await TenantService.findOne({
        id: tenant_id
      });

      if (!db_name || !db_username || !db_password) {
        throw new BadRequestError('Tenant database error, missing credentials');
      }

      const DSI = new DashboardService({
        db_username,
        db_password,
        db_name
      });

      await DSI.updateUser({ id: authUser.id }, dashboardUserData.data);
      await DSI.terminateConnection();
    }

    return authUser;
  }

  public async deleteOneWithTenant(
    filterData: Partial<AuthUserSelect>,
    tenant_id: TenantSelect['id']
  ): Promise<AuthUserSelect> {
    const authUser = await super.deleteOne(filterData);

    const { db_name, db_username, db_password } = await TenantService.findOne({
      id: tenant_id
    });

    if (!db_name || !db_username || !db_password) {
      throw new BadRequestError('Tenant database error, missing credentials');
    }

    const DSI = new DashboardService({
      db_username,
      db_password,
      db_name
    });

    await DSI.deleteUser({ id: authUser.id });
    await DSI.terminateConnection();

    await UserTenantService.deleteOne({
      user_id: authUser.id,
      tenant_id
    });

    return authUser;
  }

  public async createJwtToken({
    user_id,
    tenant_id
  }: {
    user_id: AuthUserSelect['id'],
    tenant_id?: TenantSelect['id']
  }): Promise<string> {
    try {
      const { SMTP_SECRET } = config;

      return jwt.sign(
        {
          user_id,
          tenant_id
        },
        SMTP_SECRET,
        { expiresIn: '15m' }
      );
    } catch (error) {
      throw new CustomError('Could not create jwt token', 500);
    }
  }

  public async verifyJwtToken(token: string): Promise<{
    user_id: AuthUserSelect['id'],
    tenant_id?: TenantSelect['id']
  }> {
    try {
      const { SMTP_SECRET } = config;
      const { user_id, tenant_id } = jwt.verify(token, SMTP_SECRET) as jwt.JwtPayload;

      return {
        user_id,
        tenant_id
      };
    } catch (error) {
      throw new BadRequestError('Invalid reset password token');
    }
  }
}

const USI = new UserService();

export default USI;
