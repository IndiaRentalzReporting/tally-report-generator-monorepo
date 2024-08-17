import { BaseServiceNew } from '@trg_package/base-service';
import { ModuleSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';

export class ModuleService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ModuleSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, ModuleSchema, db.query.ModuleSchema);
  }
}
