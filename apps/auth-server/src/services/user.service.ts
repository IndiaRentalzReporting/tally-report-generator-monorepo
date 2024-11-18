import { UserService as BaseUserService } from '@trg_package/schemas-auth/services';
import {
  DetailedUser as AuthDetailedUser,
  UserInsertSchema as AuthUserInsertSchema,
  UserSelect as AuthUserSelect
} from '@trg_package/schemas-auth/types';
import {
  UserInsertSchema as DashboardUserInsertSchema
} from '@trg_package/schemas-dashboard/types';
import { BadRequestError, CustomError } from '@trg_package/errors';
import jwt from 'jsonwebtoken';
import TenantService from './tenant.service';
import { authDb } from '../models/auth/index';
import config from '@/config';
import DashboardService from './DashboardService';
import { UserInsert, UserSelect } from '@/types/user';

class UserService extends BaseUserService {
  constructor() {
    super(authDb);
  }

  public async findOne(
    data: Partial<AuthUserSelect>
  ): Promise<NonNullable<Express.User>> {
    const authUser = await super.findOne(data, {
      with: {
        tenant: true
      }
    }) as AuthDetailedUser;

    const { db_name, db_username, db_password } = await TenantService.findOne(
      { id: authUser.tenant_id }
    );

    if (!db_name || !db_username || !db_password) {
      throw new BadRequestError('Tenant database error, missing credentials');
    }

    const DSI = new DashboardService({
      db_username,
      db_password,
      db_name
    });
    const dashboardUser = await DSI.findUser({ id: authUser.id });
    await DSI.terminateConnection();

    return Object.assign(authUser, dashboardUser);
  }

  public async createOne(data: UserInsert): Promise<AuthUserSelect> {
    const authUserData = AuthUserInsertSchema.parse(data);
    const dashboardUserData = DashboardUserInsertSchema.parse(data);

    const authUser = await super.createOne(authUserData);
    const { db_name, db_username, db_password } = await TenantService.findOne({
      id: authUser.tenant_id
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

    return authUser;
  }

  public async updateOne(
    filterDate: Partial<AuthUserSelect>,
    data: Partial<UserSelect>
  ): Promise<AuthUserSelect> {
    const authUserData = AuthUserInsertSchema.partial().safeParse(data);
    const dashboardUserData = DashboardUserInsertSchema.partial().safeParse(data);

    if (!authUserData.success) {
      throw new BadRequestError('Could not find user in auth database');
    }
    const authUser = await super.updateOne(filterDate, authUserData.data);

    if (dashboardUserData.success) {
      const { db_name, db_username, db_password } = await TenantService.findOne({
        id: authUser.tenant_id
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

  public async deleteOne(filterData: Partial<AuthUserSelect>): Promise<AuthUserSelect> {
    const authUser = await super.deleteOne(filterData);

    const { db_name, db_username, db_password } = await TenantService.findOne({
      id: authUser.tenant_id
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

    return authUser;
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
