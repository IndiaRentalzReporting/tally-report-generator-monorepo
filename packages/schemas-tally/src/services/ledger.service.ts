import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { LedgerSchema, LedgerTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class LedgerService extends TallyService<
  typeof tallySchemas,
  typeof LedgerSchema,
  typeof LedgerTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, LedgerSchema, LedgerTempSchema, db.query.LedgerSchema);
  }
}
