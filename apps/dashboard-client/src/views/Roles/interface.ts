import { Dispatch, SetStateAction } from 'react';
import { RoleSelect } from '../../../../../packages/schemas-dashboard/dist/types';

export interface State extends Pick<RoleSelect, 'id' | 'name'> {}

export const initialState: State = {
  id: '',
  name: ''
};

export interface StateAsProps {
  roleData: State;
  setRoleData: Dispatch<SetStateAction<State>>;
}
