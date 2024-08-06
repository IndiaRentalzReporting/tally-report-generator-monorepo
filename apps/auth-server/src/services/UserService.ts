import db from '../models';
import { UserSchema, UserSelect, DetailedUser } from '../models/schema';
import BaseService from './BaseService';

class UserService extends BaseService<
  typeof UserSchema,
  typeof db.query.UserSchema
> {
  constructor() {
    super(UserSchema, db.query.UserSchema);
  }

  public async findOneDetailedUser(
    data: Partial<typeof this.schema.$inferSelect>
  ): Promise<NonNullable<ReturnType<typeof this.tableName.findFirst>>> {
    return super.findOne(data);
  }
}

const USI = new UserService();

export default USI;
