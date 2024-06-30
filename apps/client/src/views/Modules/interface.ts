import { Dispatch, SetStateAction } from 'react';
import { Module } from '@/models';

export interface State
  extends Pick<Module, 'id' | 'name' | 'icon' | 'isPrivate'> {}

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
