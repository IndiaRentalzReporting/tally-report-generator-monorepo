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

    try {
      const { id: role_id } = await this.RoleService.findOne({
        name
      });
      const { id: permission_id } = await this.PermissionService.createOne({
        module_id,
        role_id
      });

      const actions = await this.ActionService.findMany({});

      const promises = actions.map(
        async ({ id: action_id }) =>
          await this.PermissionActionService.createOne({
            permission_id,
            action_id
          })
      );

      await Promise.all(promises);
    } catch (error) {
      if (error instanceof NotFoundError) {
        console.log('Superuser Role not found');
      } else {
        throw error;
      }
    }
  }
}
