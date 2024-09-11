import { BaseServiceNew } from '@trg_package/base-service';
import { PermissionActionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';

export class PermissionActionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionActionSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionActionSchema, db.query.PermissionActionSchema);
  }
}
