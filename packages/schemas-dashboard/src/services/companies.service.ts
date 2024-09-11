import { BaseServiceNew } from '@trg_package/base-service';
import * as dashboardSchemas from '../schemas';
import { CompanySchema } from '@/schemas/companies';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class CompaniesService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof CompanySchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, CompanySchema, db.query.CompanySchema);
  }
}
