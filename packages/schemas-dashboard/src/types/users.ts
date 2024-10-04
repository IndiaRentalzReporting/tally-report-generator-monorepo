import {
  type UserInsert,
  type UserSelect,
  UserInsertSchema,
  UserSelectSchema
} from '../schemas/users';
import { ActionSelect } from '../schemas/actions';
import { ModuleSelect } from '../schemas/modules';
import { RoleSelect } from '../schemas/roles';
import { type PermissionSelect } from '../schemas/permissions';
import { type PermissionActionSelect } from './permission_action';

type UserRole = {
  permission: Array<
    PermissionSelect & {
      permissionAction: Array<
        PermissionActionSelect & {
          action: ActionSelect;
        }
      >;
      module: ModuleSelect;
    }
  >;
};

type DetailedUser = UserSelect & {
  role: (RoleSelect & UserRole) | null;
};

export {
  type DetailedUser,
  type UserRole,
  UserInsert,
  UserSelect,
  UserInsertSchema,
  UserSelectSchema
};
