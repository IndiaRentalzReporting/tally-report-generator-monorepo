import {
  ModulePermissions,
  ModuleAction
} from '@trg_package/dashboard-schemas/types';

export const createPermissionsUsingModulePermissions = (
  modulePermissions: ModulePermissions
): Array<ModuleAction> => {
  const permissions: Array<ModuleAction> = [];
  for (const module_id in modulePermissions) {
    const module = modulePermissions[module_id];
    const p: ModuleAction = {
      module_id,
      action_ids: []
    };
    if (module)
      for (const action_id in module)
        if (module[action_id]) p.action_ids.push(action_id);
    permissions.push(p);
  }
  return permissions;
};
