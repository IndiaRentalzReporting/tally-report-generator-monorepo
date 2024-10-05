import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PermissionSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';

export class PermissionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionSchema, db.query.PermissionSchema);
  }

  public async findMany(data: Partial<typeof this.schema.$inferSelect> = {}) {
    const permissions = await super.findMany(data, {
      with: {
        module: true,
        permissionAction: {
          with: {
            action: true
          }
        },
        role: true
      }
    });

    return permissions;
  }
}
