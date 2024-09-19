import { BaseServiceNew } from '@trg_package/base-service';
import { StockCategorySchema,StockCategoryTempSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class StockCategoryService extends TallyService<
  typeof tallySchemas,
  typeof StockCategorySchema,
  typeof StockCategoryTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, StockCategorySchema,StockCategoryTempSchema,db.query.StockCategorySchema);
  }
}
