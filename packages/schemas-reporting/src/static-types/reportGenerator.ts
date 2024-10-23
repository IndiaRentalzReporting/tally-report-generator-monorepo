import { FilterTypes } from './filterTypes';
import { ReportColumnConfig } from './reportColumn';

export type GeneratedReportColumns = ReportColumnConfig[];

export type GeneratedReportData = Array<{ [T in GeneratedReportColumns[number]['alias'] ] : any }>;

export type GeneratedReportFilters =
{
  filterType : FilterTypes;
  data : Array<{ label : string,value : string }> | null
  label : string,
  fieldName : string
};
