import { BaseServiceNew } from '@trg_package/base-service';
import { UserSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UserInsert, UserSelect } from '../schemas/user';
import * as authSchemas from '../schemas';
import { hashPassword } from '@trg_package/utils';
export class UserService extends BaseServiceNew<
  typeof authSchemas,
  typeof UserSchema
> {
  constructor(db: PostgresJsDatabase<typeof authSchemas>) {
    super(db, UserSchema, db.query.UserSchema);
  }

  public async createOne(data: UserInsert): Promise<UserSelect> {
    const user = await super.createOne({
      ...data,
      password: await hashPassword(data.password)
    });
    return user;
  }
}