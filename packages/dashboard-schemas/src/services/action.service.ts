import { BaseServiceNew } from '@trg_package/base-service';
import { ActionSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ActionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ActionSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, ActionSchema, db.query.ActionSchema);
  }
}
