import db from '../models';
import { UserService } from '@trg_package/dashboard-schemas/services';

const USI = new UserService(db);

export default USI;
