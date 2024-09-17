import { BaseServiceNew } from '@trg_package/base-service';
import { UserCompanySchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';

export class UserCompanyService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof UserCompanySchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, UserCompanySchema, db.query.UserCompanySchema);
  }
}
