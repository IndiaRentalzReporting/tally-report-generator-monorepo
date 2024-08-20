import { TenantService } from '@trg_package/auth-schemas/services';
import { authDb } from '../models';

const TSI = new TenantService(authDb);

export default TSI;
