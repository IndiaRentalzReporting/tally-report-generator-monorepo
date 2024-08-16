import db from '../models/auth';
import * as authSchemas from '../models/auth/schema';
import { UserSchema } from '../models/auth/schema';
import { BaseService } from '@fullstack_package/base-schemas/services';

class UserService extends BaseService<
  typeof authSchemas,
  typeof UserSchema,
  typeof db.query.UserSchema
> {
  constructor() {
    super(db, UserSchema, db.query.UserSchema);
  }
}

const USI = new UserService();

export default USI;
