import { BaseServiceNew } from '@trg_package/base-service';
import { PermissionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';

export class PermissionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionSchema, db.query.PermissionSchema);
  }
}
