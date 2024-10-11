import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { RoleSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';

export class RoleService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof RoleSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, RoleSchema, db.query.RoleSchema);
  }

  public async findMany(data: Partial<typeof this.schema.$inferSelect> = {}) {
    const roles = await super.findMany(data, {
      with: {
        permission: true
      }
    });
    return roles;
  }

  public async findOne(data: Partial<typeof this.schema.$inferSelect>) {
    const role = await super.findOne(data, {
      with: {
        permission: {
          with: {
            permissionAction: {
              with: {
                action: true
              }
            },
            module: true
          }
        }
      }
    });

    return role;
  }
}
