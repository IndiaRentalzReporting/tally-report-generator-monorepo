import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UnitSchema, UnitTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class UnitService extends TallyService<
  typeof tallySchemas,
  typeof UnitSchema,
  typeof UnitTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, UnitSchema, UnitTempSchema, db.query.UnitSchema);
  }
}
