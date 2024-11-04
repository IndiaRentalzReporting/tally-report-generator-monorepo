import { FilterOperations, FilterTypes } from './filters';
import { ReportColumnConfig } from './columns';

export type GeneratedReportColumns = ReportColumnConfig[];

export type GeneratedReportData = Array<{ [T in GeneratedReportColumns[number]['alias'] ] : string }>;

export type GeneratedReportFilters =
{
  filterType : FilterTypes;
  data : Array<{ label : string,value : string }> | null
  label : string,
  fieldName : string
};

export type RuntimeFilters = {
  [K : string] : typeof FilterOperations[FilterTypes]['params']
};
