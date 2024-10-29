import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { InventoryVoucherSchema, InventoryVoucherTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class InventoryVoucherService extends TallyService<
  typeof tallySchemas,
  typeof InventoryVoucherSchema,
  typeof InventoryVoucherTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, InventoryVoucherSchema, InventoryVoucherTempSchema, db.query.InventoryVoucherSchema);
  }
}
