import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PermissionActionSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';

export class PermissionActionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionActionSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionActionSchema, db.query.PermissionActionSchema);
  }
}
