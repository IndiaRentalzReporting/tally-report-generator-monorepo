import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UserTallyCompanySchema } from '../schemas';
import * as dashboardSchemas from '../schemas';

export class UserTallyCompanyService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof UserTallyCompanySchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, UserTallyCompanySchema, db.query.UserTallyCompanySchema);
  }
}
