import db from '../models';
import config from '../config';
import PermissionActionService from './PermissionActionService';
import ActionService from './ActionService';
import RoleService from './RoleService';
import { PermissionService as BasePermissionService } from '@trg_package/dashboard-schemas/services';

class PermissionService extends BasePermissionService {
  constructor() {
    super(db);
  }

  public async extendSuperuserActions(action_id: string) {
    const { SUPER_USER_NAME: name } = config;
    const { id: role_id } = await RoleService.findOne({
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
    await PermissionActionService.createOne({ permission_id, action_id });
  }

  public async extendSuperuserModules(module_id: string) {
    const { SUPER_USER_NAME: name } = config;

    const { id: role_id } = await RoleService.findOne({
      name
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
