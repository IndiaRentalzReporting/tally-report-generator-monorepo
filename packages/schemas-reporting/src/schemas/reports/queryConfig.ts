import { ReportColumnConfig } from './columns';
import { ReportFilterConfig } from './filters';

export type ReportQueryConfigSelect = {
  dataSource: string;
  columns: ReportColumnConfig[] | null;
  filters: ReportFilterConfig | null;
};
