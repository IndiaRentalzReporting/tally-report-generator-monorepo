import { Dispatch, SetStateAction } from 'react';
import { ReportSelect } from '@trg_package/schemas-reporting/types';

export interface State
  extends Pick<ReportSelect, 'id' | 'name' | 'baseEntity' | 'description'> {}

export const initialState: State = {
  id: '',
  name: '',
  baseEntity: '',
  description: ''
};

export interface StateAsProps {
  reportData: State;
  setReportData: Dispatch<SetStateAction<State>>;
}
