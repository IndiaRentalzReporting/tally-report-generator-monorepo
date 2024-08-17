import { BaseServiceNew } from '@trg_package/base-service';
import { ActionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ActionService extends BaseServiceNew<typeof ActionSchema> {
  constructor(db: PostgresJsDatabase<any>) {
    super(db, ActionSchema);
  }
}
