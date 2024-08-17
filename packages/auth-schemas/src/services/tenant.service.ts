import { BaseServiceNew } from '@trg_package/base-service';
import { TenantSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class TenantService extends BaseServiceNew<typeof TenantSchema> {
  constructor(db: PostgresJsDatabase<any>) {
    super(db, TenantSchema);
  }
}
