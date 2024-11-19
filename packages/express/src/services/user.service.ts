import { UserService as BaseUserService } from '@trg_package/schemas-auth/services';
import {
  DetailedUser as AuthDetailedUser,
  UserSelect as AuthUserSelect
} from '@trg_package/schemas-auth/types';
import { BadRequestError } from '@trg_package/errors';
import TenantService from './tenant.service';
import { authDb } from '../models/auth/index';
import DashboardService from './dashboard.service';

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
}

const USI = new UserService();

export default USI;
