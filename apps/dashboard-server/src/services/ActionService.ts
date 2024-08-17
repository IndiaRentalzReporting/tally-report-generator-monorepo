import db from '../models';
import { ActionService } from '@trg_package/dashboard-schemas/services';

const ASI = new ActionService(db);

export default ASI;
