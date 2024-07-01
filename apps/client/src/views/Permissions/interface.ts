import { Dispatch, SetStateAction } from 'react';
import { DetailedPermission } from '@/models';

export interface State
  extends Pick<
    DetailedPermission,
    'id' | 'module' | 'role' | 'permissionAction'
  > {}

export const initialState: State = {
  id: '',
  module: {
    name: ''
  },
  permissionAction: [],
  role: {
    name: ''
  }
};

export interface StateAsProps {
  permissionsPermissionsData: State;
  setPermissionsData: Dispatch<SetStateAction<State>>;
}
