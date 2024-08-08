import { Dispatch, SetStateAction } from 'react';
import { Role } from '@/models';

export interface State extends Pick<Role, 'id' | 'name'> {}

export const initialState: State = {
  id: '',
  name: ''
};

export interface StateAsProps {
  roleData: State;
  setRoleData: Dispatch<SetStateAction<State>>;
}
