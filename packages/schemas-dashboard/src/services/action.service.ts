import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReadError } from '@trg_package/errors';
import { ActionSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { ActionInsert, ActionSelect } from '../types';
import { RoleService } from './role.service';
import { PermissionActionService } from './permission_action.service';
import { PermissionService } from './permission.service';
import { ModuleService } from './module.service';

export class ActionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ActionSchema
> {
  private RoleService: RoleService;

  private PermissionService: PermissionService;

  private ModuleService?: ModuleService;

  private PermissionActionService: PermissionActionService;

  constructor(
    db: PostgresJsDatabase<typeof dashboardSchemas>,
    moduleService?: ModuleService
  ) {
    super(db, ActionSchema, db.query.ActionSchema);
    this.RoleService = new RoleService(db);
    this.PermissionService = new PermissionService(db);
    this.ModuleService = moduleService;
    this.PermissionActionService = new PermissionActionService(db);
  }

  public setModuleService(moduleService: ModuleService) {
    this.ModuleService = moduleService;
  }

  public async createOne(data: ActionInsert): Promise<ActionSelect> {
    const action = await super.createOne(data);

    await this.extendSuperuserActions(action);

    return action;
  }

  private async extendSuperuserActions(action: ActionSelect) {
    const name = 'SUPERUSER';

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

    if (!this.ModuleService) {
      throw new Error('ModuleService not initialized');
    }

    for (const permission of permissions) {
      const module = await this.ModuleService?.findOne({ id: permission.module_id });

      const isPrivate = module.isPrivate || action.isPrivate;

      await this.PermissionActionService.createOne({
        permission_id: permission.id,
        action_id: action.id,
        isPrivate,
        isReadonly: true
      });
    }
  }
}
