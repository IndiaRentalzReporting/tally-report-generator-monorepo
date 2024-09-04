import { Dispatch, SetStateAction } from 'react';
import { DetailedUser } from '@trg_package/dashboard-schemas/types';

export interface State
  extends Pick<
    DetailedUser,
    'id' | 'first_name' | 'last_name' | 'email' | 'role'
  > {
  password: string;
}

export const initialState: State = {
  id: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: null
};

export interface StateAsProps {
  userData: State;
  setUserData: Dispatch<SetStateAction<State>>;
}
