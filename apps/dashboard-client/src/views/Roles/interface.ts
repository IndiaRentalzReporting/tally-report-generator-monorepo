import { Dispatch, SetStateAction } from 'react';
import { RoleSelect } from '@trg_package/schemas-dashboard/types';

export interface State extends Pick<RoleSelect, 'id' | 'name'> {}

export const initialState: State = {
  id: '',
  name: ''
};

export interface StateAsProps {
  roleData: State;
  setRoleData: Dispatch<SetStateAction<State>>;
}
