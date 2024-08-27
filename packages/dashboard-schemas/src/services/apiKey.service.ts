import { BaseServiceNew } from '@trg_package/base-service';
import { ApiKeysSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ApiKeyService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ApiKeysSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, ApiKeysSchema, db.query.ApiKeysSchema);
  }
}
