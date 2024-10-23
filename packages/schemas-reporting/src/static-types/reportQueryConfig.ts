import { ReportColumnConfig } from './reportColumn';
import { ReportFilterConfig } from './reportFilter';

export type ReportConfigSelect = {
  dataSource: string; // query used to fetch data
  columns: ReportColumnConfig[] | null; // required to create the table
  filters: ReportFilterConfig | null; // required to create filter tab
};
