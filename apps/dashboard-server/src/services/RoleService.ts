import db from '../models';
import { RoleService } from '@trg_package/dashboard-schemas/services';

const RSI = new RoleService(db);

export default RSI;
