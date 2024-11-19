import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportAccessSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

export class ReportAccessService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ReportAccessSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ReportAccessSchema, db.query.ReportAccessSchema);
  }

}
