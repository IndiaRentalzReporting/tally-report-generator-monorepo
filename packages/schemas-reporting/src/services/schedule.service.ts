import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ScheduleSchema } from '../schemas';
import * as reportingSchemas from '../schemas';

export class ScheduleService extends BaseServiceNew<
  typeof reportingSchemas,
  typeof ScheduleSchema
> {
  constructor(db: PostgresJsDatabase<typeof reportingSchemas>) {
    super(db, ScheduleSchema, db.query.ScheduleSchema);
  }
}
