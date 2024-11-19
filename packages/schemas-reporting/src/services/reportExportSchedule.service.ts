import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportExportScheduleSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

export class ReportExportScheduleService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ReportExportScheduleSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ReportExportScheduleSchema, db.query.ReportExportScheduleSchema);
  }

}
