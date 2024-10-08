import { ActionSelect } from '../schemas/actions';
import { ModuleSelect } from '../schemas/modules';
import {
  type PermissionSelect,
  type PermissionInsert,
  PermissionInsertSchema,
  PermissionSelectSchema
} from '../schemas/permissions';
import { RoleSelect } from '../schemas/roles';

interface DetailedPermission extends PermissionSelect {
  module: Pick<ModuleSelect, 'name' | 'id'>;
  role: Pick<RoleSelect, 'name' | 'id'>;
  permissionAction: Array<{ action: Pick<ActionSelect, 'name' | 'id'> }>;
}

interface Permissions {
  module: Pick<ModuleSelect, 'icon' | 'name'>;
  actions: ActionSelect['name'][];
}

interface ModulePermissions {
  [module_id: string]: {
    [action_id: string]: boolean;
  };
}

interface ModuleAction {
  module_id: ModuleSelect['id'];
  action_ids: ActionSelect['id'][];
}

export {
  type DetailedPermission,
  type Permissions,
  type ModulePermissions,
  type ModuleAction,
  PermissionInsert,
  PermissionSelect,
  PermissionInsertSchema,
  PermissionSelectSchema
};
