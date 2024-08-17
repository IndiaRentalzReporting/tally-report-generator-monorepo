import { BaseServiceNew } from '@trg_package/base-service';
import { PermissionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class PermissionService extends BaseServiceNew<typeof PermissionSchema> {
  constructor(db: PostgresJsDatabase<any>) {
    super(db, PermissionSchema);
  }
}
