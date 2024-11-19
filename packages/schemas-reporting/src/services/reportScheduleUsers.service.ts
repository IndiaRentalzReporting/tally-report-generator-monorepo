import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReportScheduleUsersSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

export class ReportScheduleUsersService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ReportScheduleUsersSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ReportScheduleUsersSchema, db.query.ReportScheduleUsersSchema);
  }
}
