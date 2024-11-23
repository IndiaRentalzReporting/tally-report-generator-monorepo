import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UserTenantSchema } from '../schemas';
import * as authSchemas from '../schemas';

export class UserTenantService extends BaseServiceNew<
  typeof authSchemas,
  typeof UserTenantSchema
> {
  constructor(db: PostgresJsDatabase<typeof authSchemas>) {
    super(db, UserTenantSchema, db.query.UserTenantSchema);
  }
}
