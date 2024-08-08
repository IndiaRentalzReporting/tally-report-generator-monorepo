import { Permission } from '../Permissions';

export interface Role {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermission extends Role {
  permission: Array<Pick<Permission, 'id'>>;
}
