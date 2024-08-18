import { Dispatch, SetStateAction } from 'react';
import { ModuleSelect } from '@trg_package/dashboard-schemas/types';

export interface State
  extends Pick<ModuleSelect, 'id' | 'name' | 'icon' | 'isPrivate'> {}

export const initialState: State = {
  id: '',
  name: '',
  isPrivate: false,
  icon: ''
};

export interface StateAsProps {
  moduleData: State;
  setModuleData: Dispatch<SetStateAction<State>>;
}
