import { BaseServiceNew } from '@trg_package/base-service';
import { RoleSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';

export class RoleService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof RoleSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, RoleSchema, db.query.RoleSchema);
  }
}
