import { Dispatch, SetStateAction } from 'react';
import { Action } from '@/models';

export interface State extends Pick<Action, 'id'> {
  name: string;
}

export const initialState: State = {
  id: '',
  name: ''
};

export interface StateAsProps {
  actionData: State;
  setActionData: Dispatch<SetStateAction<State>>;
}
