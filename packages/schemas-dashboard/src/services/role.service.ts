import { BaseServiceNew } from '@trg_package/base-service';
import { RoleSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
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
        permission: {
          columns: {
            //@ts-ignore
            id: true
          }
        }
      }
    });
    return roles;
  }

  public async findOne(data: Partial<typeof this.schema.$inferSelect>) {
    const role = await super.findOne(data, {
      with: {
        permission: {
          columns: {
            //@ts-ignore
            module_id: false,
            updatedAt: false,
            role_id: false,
            createdAt: false,

            id: false
          },
          with: {
            permissionAction: {
              columns: {
                permission_id: false,
                action_id: false
              },
              with: {
                action: {
                  columns: {
                    name: true,
                    id: true
                  }
                }
              }
            },
            module: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        }
      }
    });

    return role;
  }
}
