import {
  type RoleInsert,
  type RoleSelect,
  RoleInsertSchema,
  RoleSelectSchema,
  type ActionSelect,
  type ModuleSelect,
  type PermissionSelect
} from '../schemas';

type DetailedRole = RoleSelect & {
  permission: Array<{
    permissionAction: Array<{
      action: {
        name: ActionSelect['name'];
        id: ActionSelect['id'];
      };
    }>;
    module: {
      name: ModuleSelect['name'];
      id: ModuleSelect['id'];
    };
  }>;
};

interface RoleWithPermission extends RoleSelect {
  permission: Array<Pick<PermissionSelect, 'id'>>;
}

export {
  RoleInsert,
  RoleSelect,
  RoleInsertSchema,
  RoleSelectSchema,
  type DetailedRole,
  type RoleWithPermission,
  ActionSelect,
  ModuleSelect,
  PermissionSelect
};
