import { UserService as BaseUserService } from '@trg_package/auth-schemas/services';
import { UserService as DashboardUserService } from '@trg_package/dashboard-schemas/services';
import { authDb, createDashboardClient } from '../models/index';
import { UserSelect } from '@trg_package/auth-schemas/types';
import TenantService from './TenantService';
import { BadRequestError } from '@trg_package/errors';
import { DetailedUser } from '@trg_package/dashboard-schemas/types';

class UserService extends BaseUserService {
  constructor() {
    super(authDb);
  }

  public async findOne(
    data: Partial<UserSelect>
  ): Promise<UserSelect & DetailedUser> {
    const user = (await super.findOne(data)) as UserSelect & DetailedUser;
    if (!!data.tenant_id && !!data.email) {
      const { email, tenant_id } = data;
      const { db_name, db_username, db_password } = await TenantService.findOne(
        { id: tenant_id }
      );

      if (!db_name || !db_username || !db_password) {
        throw new BadRequestError('Tenant database error, missing credentials');
      }

      const { client: dashboard_db, connection: dashboard_connection } =
        await createDashboardClient({
          db_username,
          db_password,
          db_name
        });

      const USI = new DashboardUserService(dashboard_db);
      const { role_id, role } = await USI.findOneDetailedUser({ email });

      dashboard_connection.end();
      user.role_id = role_id;
      user.role = role;
    }
    return user;
  }
}

const USI = new UserService();

export default USI;
