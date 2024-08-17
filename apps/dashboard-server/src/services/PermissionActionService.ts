import db from '../models';
import { PermissionActionService } from '@trg_package/dashboard-schemas/services';

const PASI = new PermissionActionService(db);

export default PASI;
