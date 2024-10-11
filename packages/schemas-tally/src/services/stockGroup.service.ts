import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { StockGroupSchema, StockGroupTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class StockGroupService extends TallyService<
  typeof tallySchemas,
  typeof StockGroupSchema,
  typeof StockGroupTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(
      db,
      StockGroupSchema,
      StockGroupTempSchema,
      db.query.StockGroupSchema
    );
  }
}
