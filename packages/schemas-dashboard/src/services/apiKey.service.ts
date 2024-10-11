import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ApiKeySchema } from '../schemas';
import * as dashboardSchemas from '../schemas';

export class ApiKeyService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ApiKeySchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, ApiKeySchema, db.query.ApiKeySchema);
  }
}
