import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportUserSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

export class ReportUserService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ReportUserSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ReportUserSchema, db.query.ReportUserSchema);
  }
}
