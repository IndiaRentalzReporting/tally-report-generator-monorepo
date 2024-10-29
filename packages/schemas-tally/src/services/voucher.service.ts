import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { VoucherSchema, VoucherTempSchema } from '../schemas';
import * as tallySchemas from '../schemas';
import { TallyService } from './tally.service';

export class VoucherService extends TallyService<
  typeof tallySchemas,
  typeof VoucherSchema,
  typeof VoucherTempSchema
> {
  constructor(db: PostgresJsDatabase<typeof tallySchemas>) {
    super(db, VoucherSchema, VoucherTempSchema, db.query.VoucherSchema);
  }
}
