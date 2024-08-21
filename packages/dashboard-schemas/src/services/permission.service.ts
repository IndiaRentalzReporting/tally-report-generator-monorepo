import { BaseServiceNew } from '@trg_package/base-service';
import { PermissionSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';
import { ActionService } from './action.service';
import { PermissionActionService } from './permissionAction.service';
import { RoleService } from './role.service';

export class PermissionService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof PermissionSchema
> {
  private RoleService: RoleService;
  private ActionService: ActionService;
  private PermissionActionService: PermissionActionService;

  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, PermissionSchema, db.query.PermissionSchema);
    this.RoleService = new RoleService(db);
    this.ActionService = new ActionService(db);
    this.PermissionActionService = new PermissionActionService(db);
  }

  public async extendSuperuserActions(action_id: string) {
    let name = 'temp';

    const { id: role_id } = await this.RoleService.findOne({
      name
    });
    const permissions = await this.findMany({ role_id });

    console.log({
      role_id,
      permissions
    });

    const promises = permissions.map(async ({ id: permission_id }) =>
      this.assignAction({ permission_id, action_id })
    );

    await Promise.all(promises);
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

  public async extendSuperuserModules(module_id: string) {
    let name = 'temp';

    const { id: role_id } = await this.RoleService.findOne({
      name
    });
    const { id: permission_id } = await super.createOne({
      module_id,
      role_id
    });

    const actions = await this.ActionService.findMany({});

    const promises = actions.map(async ({ id: action_id }) =>
      this.assignAction({ permission_id, action_id })
    );

    await Promise.all(promises);
  }
}
