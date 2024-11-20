import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ScheduleUserSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

export class ScheduleUserService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ScheduleUserSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ScheduleUserSchema, db.query.ScheduleUserSchema);
  }
}
