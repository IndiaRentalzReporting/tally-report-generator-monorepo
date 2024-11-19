import { TenantService as BaseTenantService } from '@trg_package/schemas-auth/services';
import { authDb } from '../models/auth/index';

class TenantService extends BaseTenantService {
  constructor() {
    super(authDb);
  }
}

const TSI = new TenantService();

export default TSI;
