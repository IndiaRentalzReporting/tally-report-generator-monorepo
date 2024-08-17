import { UserService } from '@trg_package/auth-schemas/services';
import db from '../models/auth/index';

const USI = new UserService(db);

export default USI;
