import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { StockCategorySchema, StockCategoryTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class StockCategoryService extends TallyService<
  typeof tallySchemas,
  typeof StockCategorySchema,
  typeof StockCategoryTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(
      db,
      StockCategorySchema,
      StockCategoryTempSchema,
      db.query.StockCategorySchema
    );
  }
}
