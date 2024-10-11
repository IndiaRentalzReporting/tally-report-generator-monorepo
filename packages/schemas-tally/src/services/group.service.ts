import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { GroupSchema, GroupTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class GroupService extends TallyService<
  typeof tallySchemas,
  typeof GroupSchema,
  typeof GroupTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, GroupSchema, GroupTempSchema, db.query.GroupSchema);
    const d = GroupSchema.$inferInsert;
  }
}
