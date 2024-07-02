import { Action } from '../Actions';
import { Module } from '../Modules';
import { Permission } from '../Permissions';
import { Role } from '../Roles';

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
        action: Pick<Action, 'name'>;
      }>;
      module: Pick<Module, 'id' | 'icon' | 'name'>;
    }>;
  } | null;
}
