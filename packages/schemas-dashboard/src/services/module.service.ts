import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { ReadError } from '@trg_package/errors';
import { ModuleSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { ModuleInsert, ModuleSelect } from '../types';
import {
  ActionService,
  PermissionActionService,
  PermissionService,
  RoleService
} from '.';

export class ModuleService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof ModuleSchema
> {
  private RoleService: RoleService;

  private PermissionService: PermissionService;

  private ActionService: ActionService;

  private PermissionActionService: PermissionActionService;

  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, ModuleSchema, db.query.ModuleSchema);
    this.RoleService = new RoleService(db);
    this.PermissionService = new PermissionService(db);
    this.ActionService = new ActionService(db);
    this.PermissionActionService = new PermissionActionService(db);

    this.ActionService.setModuleService(this);
  }

  public async createOne(data: ModuleInsert): Promise<ModuleSelect> {
    const module = await super.createOne(data);

    await this.extendSuperuserModules(module);

    return module;
  }

  private async extendSuperuserModules(module: ModuleSelect) {
    const name = 'SUPERUSER';

    const role = await this.RoleService.findOne({
      name
    }).catch((e) => {
      if (e instanceof ReadError) return null;
      throw e;
    });

    if (!role) return;

    const { id: role_id } = role;

    const permission = await this.PermissionService.createOne({
      role_id,
      module_id: module.id,
      isPrivate: module.isPrivate,
      isReadonly: true
    });

    const actions = await this.ActionService.findMany().catch((e) => {
      if (e instanceof ReadError) return null;
      throw e;
    });

    if (!actions) return;

    for (const action of actions) {
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
