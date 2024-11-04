import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tallySchemas from '../schemas';
import { CompanySchema } from '../schemas';

export class CompanyService extends BaseServiceNew
  <
    typeof tallySchemas,
    typeof CompanySchema
  > {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, CompanySchema,db.query.CompanySchema);
  }
}
