import {
  type ModuleSelect,
  type UserInsert,
  type UserSelect,
  UserInsertSchema,
  UserSelectSchema,
  type ActionSelect,
  type PermissionSelect,
  type RoleSelect
} from '../schemas';

type RegisterUser = Pick<
  UserInsert,
  'email' | 'password' | 'first_name' | 'last_name'
>;

type LoginUser = Pick<UserSelect, 'email' | 'password'>;

type UserRole = {
  name: RoleSelect['name'];
  permission: Array<{
    id: PermissionSelect['id'];
    permissionAction: Array<{
      action: {
        name: ActionSelect['name'];
      };
    }>;
    module: {
      id: ModuleSelect['id'];
      name: ModuleSelect['name'];
      icon: ModuleSelect['icon'];
    };
  }>;
};
type DetailedUser = UserSelect & {
  role: UserRole | null;
};

export {
  type RegisterUser,
  type LoginUser,
  type DetailedUser,
  type UserRole,
  UserInsert,
  UserSelect,
  UserInsertSchema,
  UserSelectSchema
};
