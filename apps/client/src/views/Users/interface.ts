import { Dispatch, SetStateAction } from 'react';
import { User } from '@/models';

export interface State
  extends Pick<User, 'id' | 'first_name' | 'last_name' | 'email'> {
  password: string;
}

export const initialState: State = {
  id: '',
  email: '',
  password: '',
  first_name: '',
  last_name: ''
};

export interface StateAsProps {
  userData: State;
  setUserData: Dispatch<SetStateAction<State>>;
}
