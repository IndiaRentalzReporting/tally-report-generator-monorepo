import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import bcrypt from 'bcrypt';
import { UserSchema } from '@/schemas';
import * as authSchemas from '@/schemas';
import { UserInsert, UserSelect } from '@/types';

export class UserService extends BaseServiceNew<
  typeof authSchemas,
  typeof UserSchema
> {
  constructor(db: PostgresJsDatabase<typeof authSchemas>) {
    super(db, UserSchema, db.query.UserSchema);
  }

  public async createOne(data: UserInsert): Promise<UserSelect> {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(data.password, salt);
    const user = await super.createOne({
      ...data,
      password
    });
    return user;
  }

  public async updateOne(
    filterData: Partial<UserSelect>,
    data: Partial<UserInsert>
  ): Promise<UserSelect> {
    const update = data;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(data.password, salt);
      update.password = password;
    }
    const user = await super.updateOne(filterData, data);
    return user;
  }
}
