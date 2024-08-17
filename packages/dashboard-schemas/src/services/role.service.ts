import { BaseServiceNew } from '@trg_package/base-service';
import { RoleSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class RoleService extends BaseServiceNew<typeof RoleSchema> {
  constructor(db: PostgresJsDatabase<any>) {
    super(db, RoleSchema);
  }
}
