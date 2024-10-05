import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { CompanySchema, CompanyTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class CompanyService extends TallyService<
  typeof tallySchemas,
  typeof CompanySchema,
  typeof CompanyTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, CompanySchema, CompanyTempSchema, db.query.CompanySchema);
  }
}
