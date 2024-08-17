import db from '../models';
import { ModuleService } from '@trg_package/dashboard-schemas/services';

const MSI = new ModuleService(db);

export default MSI;
