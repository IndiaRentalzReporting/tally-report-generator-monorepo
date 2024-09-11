import { BaseServiceNew } from '@trg_package/base-service';
import { PermissionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';
import { PermissionActionService } from './permission_action.service';

export class PermissionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionSchema
> {
  private PermissionActionService: PermissionActionService;

  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionSchema, db.query.PermissionSchema);
    this.PermissionActionService = new PermissionActionService(db);
  }

  public async assignAction({
    permission_id,
    action_id
  }: {
    permission_id: string;
    action_id: string;
  }) {
    await this.PermissionActionService.createOne({ permission_id, action_id });
  }

  public async findMany(data: Partial<typeof this.schema.$inferSelect> = {}) {
    const permissions = await super.findMany(data, {
      with: {
        module: {
          columns: {
            //@ts-ignore
            name: true,
            id: true
          }
        },
        permissionAction: {
          columns: {
            //@ts-ignore
            action_id: false,
            permission_id: false
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
        role: {
          columns: {
            //@ts-ignore
            name: true,
            id: true
          }
        }
      }
    });

    return permissions;
  }
}
