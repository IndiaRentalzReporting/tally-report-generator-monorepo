import { TenantService } from '@trg_package/auth-schemas/services';
import { auth_db } from '../models';

const TSI = new TenantService(auth_db);

export default TSI;
