import { BaseServiceNew } from '@trg_package/base-service';
import { ActionSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ActionInsert, ActionSelect } from '../types';
import { RoleService } from './role.service';
import { PermissionActionService } from './permissionAction.service';
import { PermissionService } from './permission.service';
import { ReadError } from '@trg_package/errors';

export class ActionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ActionSchema
> {
  private RoleService: RoleService;
  private PermissionService: PermissionService;
  private PermissionActionService: PermissionActionService;
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, ActionSchema, db.query.ActionSchema);
    this.RoleService = new RoleService(db);
    this.PermissionService = new PermissionService(db);
    this.PermissionActionService = new PermissionActionService(db);
  }

  public async createOne(data: ActionInsert): Promise<ActionSelect> {
    const action = await super.createOne(data);

    await this.extendSuperuserActions(action.id);

    return action;
  }

  private async extendSuperuserActions(action_id: string) {
    let name = 'SUPERUSER';

    const role = await this.RoleService.findOne({
      name
    }).catch((e) => {
      if (e instanceof ReadError) return null;
      throw e;
    });

    if (!role) return;

    const { id: role_id } = role;

    const permissions = await this.PermissionService.findMany({
      role_id
    }).catch((e) => {
      if (e instanceof ReadError) return null;
      throw e;
    });

    if (!permissions) return;

    for (const { id: permission_id } of permissions) {
      await this.PermissionActionService.createOne({
        permission_id,
        action_id
      });
    }
  }
}
