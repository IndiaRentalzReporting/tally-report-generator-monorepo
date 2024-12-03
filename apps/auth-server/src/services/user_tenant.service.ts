import { UserTenantService as BaseUserTenantService } from '@trg_package/schemas-auth/services';
import authDb from '../models/auth';

class UserTenantService extends BaseUserTenantService {
  constructor() {
    super(authDb);
  }
}

const UTSI = new UserTenantService();

export default UTSI;
