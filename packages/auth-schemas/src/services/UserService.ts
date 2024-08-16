import { BaseServiceNew } from '@trg_package/base-schemas/services';
import { UserSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class UserService extends BaseServiceNew<typeof UserSchema> {
  constructor(db: PostgresJsDatabase<any>) {
    super(db, UserSchema);
  }
}
