import { Dispatch, SetStateAction } from 'react';
import { ReportSelect } from '@trg_package/schemas-reporting/types';

export interface State
  extends Pick<ReportSelect, 'id' | 'name' | 'baseEntity'> {}

export const initialState: State = {
  id: '',
  name: '',
  baseEntity: ''
};

export interface StateAsProps {
  reportData: State;
  setReportData: Dispatch<SetStateAction<State>>;
}
