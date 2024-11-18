import { UserService as BaseUserService } from '@trg_package/schemas-auth/services';
import { DetailedUser as AuthDetailedUser, UserSelect } from '@trg_package/schemas-auth/types';
import { BadRequestError, CustomError } from '@trg_package/errors';
import jwt from 'jsonwebtoken';
import TenantService from './TenantService';
import { authDb } from '../models/auth/index';
import config from '@/config';
import DashboardService from './DashboardService';

class UserService extends BaseUserService {
  constructor() {
    super(authDb);
  }

  public async findOne(
    data: Partial<UserSelect>
  ): Promise<NonNullable<Express.Request['user']>> {
    const authUser = (await super.findOne(data, {
      with: {
        tenant: true
      }
    })) as AuthDetailedUser;

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
