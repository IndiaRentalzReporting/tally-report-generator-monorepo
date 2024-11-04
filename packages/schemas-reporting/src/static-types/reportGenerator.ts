import { FilterOptions, FilterTypes } from './filterTypes';
import { ReportColumnConfig } from './reportColumn';

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
  [K : string] : typeof FilterOptions[FilterTypes]['params']
};
