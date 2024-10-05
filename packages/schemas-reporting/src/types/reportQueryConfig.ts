import { ReportColumnSelect } from './reportColumn';
import { ReportFilterSelect } from './reportFilter';

export type ReportConfigSelect = {
  dataSource : string, // query used to fetch data
  columns : ReportColumnSelect[], // required to create the table
  filters : ReportFilterSelect[] // required to create filter tab
};
