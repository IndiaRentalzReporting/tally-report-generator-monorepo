import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReadError } from '@trg_package/errors';
import { PermissionSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { ActionService, PermissionActionService } from '.';

export class PermissionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionSchema
> {
  private ActionService: ActionService;

  private PermissionActionService: PermissionActionService;

  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionSchema, db.query.PermissionSchema);
    this.ActionService = new ActionService(db);
    this.PermissionActionService = new PermissionActionService(db);
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

  public async deleteOne(filterData: Partial<typeof this.schema.$inferSelect>)
    : Promise<typeof this.schema.$inferSelect> {
    const permission = await super.deleteOne(filterData);

    const actions = await this.ActionService.findMany().catch((e) => {
      if (e instanceof ReadError) return null;
      throw e;
    });

    if (!actions) return permission;

    for (const { id: action_id } of actions) {
      await this.PermissionActionService.deleteOne({
        permission_id: permission.id,
        action_id
      });
    }

    return permission;
  }
}
