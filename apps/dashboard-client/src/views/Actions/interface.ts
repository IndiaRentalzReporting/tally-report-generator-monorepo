import { Dispatch, SetStateAction } from 'react';
import { ActionSelect } from '@trg_package/schemas-dashboard/types';

export interface State extends Pick<ActionSelect, 'id' | 'name'> {}

export const initialState: State = {
  id: '',
  name: ''
};

export interface StateAsProps {
  actionData: State;
  setActionData: Dispatch<SetStateAction<State>>;
}
