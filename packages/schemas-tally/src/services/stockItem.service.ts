import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { StockItemSchema, StockItemTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class StockItemService extends TallyService<
  typeof tallySchemas,
  typeof StockItemSchema,
  typeof StockItemTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, StockItemSchema, StockItemTempSchema, db.query.StockItemSchema);
  }
}
