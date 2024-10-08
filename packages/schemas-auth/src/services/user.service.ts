import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UserSchema } from '../schemas';
import { UserInsert, UserSelect } from '../schemas/users';
import * as authSchemas from '../schemas';

export class UserService extends BaseServiceNew<
  typeof authSchemas,
  typeof UserSchema
> {
  constructor(db: PostgresJsDatabase<typeof authSchemas>) {
    super(db, UserSchema, db.query.UserSchema);
  }

  public async createOne(data: UserInsert): Promise<UserSelect> {
    const user = await super.createOne(data);
    return user;
  }
}
