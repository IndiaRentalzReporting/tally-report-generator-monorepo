import { Action } from '../Actions';
import { Module } from '../Modules';

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

export interface Permissions {
  module: Pick<Module, 'icon' | 'name'>;
  actions: Action['name'][];
}
