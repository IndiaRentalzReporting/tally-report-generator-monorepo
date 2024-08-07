import db from '../models';
import { PermissionSchema } from '../models/schema';
import config from '../config';
import BaseService from './BaseService';
import PermissionActionService from './PermissionActionService';
import ActionService from './ActionService';
import RoleService from './RoleService';

class PermissionService extends BaseService<
  typeof PermissionSchema,
  typeof db.query.PermissionSchema
> {
  constructor() {
    super(PermissionSchema, db.query.PermissionSchema);
  }

  public async extendSuperuserActions(action_id: string) {
    const { id: role_id } = await RoleService.findOne({
      name: config.app.SUPER_USER_NAME
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
    await PermissionActionService.createOne({ permission_id, action_id });
  }

  public async extendSuperuserModules(module_id: string) {
    const { id: role_id } = await RoleService.findOne({
      name: config.app.SUPER_USER_NAME
    });
    const { id: permission_id } = await this.createOne({
      module_id,
      role_id
    });

    const actions = await ActionService.findMany({});

    const promises = actions.map(async ({ id: action_id }) =>
      this.assignAction({ permission_id, action_id })
    );

    await Promise.all(promises);
  }
}

const PSI = new PermissionService();

export default PSI;
