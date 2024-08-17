import { BaseServiceNew } from '@trg_package/base-service';
import { ModuleSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ModuleService extends BaseServiceNew<typeof ModuleSchema> {
  constructor(db: PostgresJsDatabase<any>) {
    super(db, ModuleSchema);
  }
}
