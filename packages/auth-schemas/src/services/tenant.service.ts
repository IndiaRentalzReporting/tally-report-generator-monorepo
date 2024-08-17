import { BaseServiceNew } from '@trg_package/base-service';
import { TenantSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as authSchemas from '../schemas';
export class TenantService extends BaseServiceNew<
  typeof authSchemas,
  typeof TenantSchema
> {
  constructor(db: PostgresJsDatabase<typeof authSchemas>) {
    super(db, TenantSchema, db.query.TenantSchema);
  }
}
