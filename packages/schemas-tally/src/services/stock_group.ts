import { BaseServiceNew } from '@trg_package/base-service';
import { StockGroupSchema,StockGroupTempSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class StockGroupService extends TallyService<
  typeof tallySchemas,
  typeof StockGroupSchema,
  typeof StockGroupTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, StockGroupSchema,StockGroupTempSchema,db.query.StockGroupSchema);
  }
}
