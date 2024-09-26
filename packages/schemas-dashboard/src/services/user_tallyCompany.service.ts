import { BaseServiceNew } from '@trg_package/base-service';
import { UserTallyCompanySchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';

export class UserTallyCompanyService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof UserTallyCompanySchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, UserTallyCompanySchema, db.query.UserTallyCompanySchema);
  }
}
