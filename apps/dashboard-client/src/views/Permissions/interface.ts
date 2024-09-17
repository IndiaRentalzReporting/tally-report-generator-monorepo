import { Dispatch, SetStateAction } from 'react';
import {
  DetailedPermission,
  ModulePermissions
} from '@trg_package/schemas-dashboard/types';
import { State as RoleState } from '../Roles/interface';

export interface State
  extends Pick<
    DetailedPermission,
    'id' | 'module' | 'role' | 'permissionAction'
  > {}

export const initialState: State = {
  id: '',
  module: {
    name: '',
    id: ''
  },
  permissionAction: [],
  role: {
    name: '',
    id: ''
  }
};

export interface StateAsProps {
  role?: RoleState['name'];
  setRole?: Dispatch<SetStateAction<RoleState['name']>>;
  modulePermissions: ModulePermissions;
  setModulePermissions: Dispatch<SetStateAction<ModulePermissions>>;
}
