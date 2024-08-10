import db from '../models/auth';
import { UserSchema } from '../models/auth/schema';
import BaseService from './BaseService';

class UserService extends BaseService<
  typeof UserSchema,
  typeof db.query.UserSchema
> {
  constructor() {
    super(UserSchema, db.query.UserSchema);
  }
}

const USI = new UserService();

export default USI;
