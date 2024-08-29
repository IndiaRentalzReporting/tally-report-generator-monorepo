import { Dispatch, SetStateAction } from 'react';
import { ActionSelect } from '../../../../../packages/schemas-dashboard/dist/types';

export interface State extends Pick<ActionSelect, 'id'> {
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
