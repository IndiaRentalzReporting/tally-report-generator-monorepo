export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
  createdAt: Date;
  updatedAt: Date;
}
export type LoginUser = Pick<User, 'email'> & { password: string };
export type RegisterUser = Pick<User, 'first_name' | 'last_name' | 'email'> & {
  password: string;
};

export interface DetailedUser extends Omit<User, 'password'> {
  role: {
    name: Role['name'];
    permission: Array<{
      id: Permission['id'];
      permissionAction: Array<{
        action: {
          name: Action['name'];
        };
      }>;
      module: {
        id: Module['id'];
        name: Module['name'];
      };
    }>;
  } | null;
}

export interface Action {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
}

export interface Module {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
}

export interface Permission {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  role_id: string;
  module_id: string;
}

export interface PermissionAction {
  permission_id: string;
  action_id: string;
}

export interface Role {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}
