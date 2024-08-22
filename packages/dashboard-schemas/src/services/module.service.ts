import { BaseServiceNew } from '@trg_package/base-service';
import { ModuleSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';
import { ModuleInsert, ModuleSelect } from '../types';
import {
  ActionService,
  PermissionActionService,
  PermissionService,
  RoleService
} from '.';
import { NotFoundError } from '@trg_package/errors';

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
  }

  public async createOne(data: ModuleInsert): Promise<ModuleSelect> {
    const module = await super.createOne(data);

    await this.extendSuperuserModules(module.id);

    return module;
  }

  private async extendSuperuserModules(module_id: string) {
    let name = 'SUPERUSER';

    const role = await this.RoleService.findOne({
      name
    }).catch((e) => {
      if (e instanceof NotFoundError) return null;
      throw e;
    });

    if (!role) return;

    const { id: role_id } = role;

    const { id: permission_id } = await this.PermissionService.createOne({
      module_id,
      role_id
    });

    const actions = await this.ActionService.findMany({}).catch((e) => {
      if (e instanceof NotFoundError) return null;
      throw e;
    });

    if (!actions) return;

    for (const { id: action_id } of actions) {
      await this.PermissionActionService.createOne({
        permission_id,
        action_id
      });
    }
  }
}
