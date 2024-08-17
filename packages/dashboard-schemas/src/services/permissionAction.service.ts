import { BaseServiceNew } from '@trg_package/base-service';
import { PermissionActionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class PermissionActionService extends BaseServiceNew<
  typeof PermissionActionSchema
> {
  constructor(db: PostgresJsDatabase<any>) {
    super(db, PermissionActionSchema);
  }
}
