import { ColumnTypeLiteral } from './ColumnTypes';

/**
 * Used by user to filter reports when report is running or viewed
 * These data filters will be picked by user after report is generated
 */
export type ReportFilterInsert = {
  columnType : ColumnTypeLiteral
  column : string, // required to fetch entries
  table : string, // required to fetch entries for select dropdown
  columnAlias : string, // required for HAVING clause of the query
  filterType : 'search' | 'select' | 'range',
};

export type ReportFilterSelect = {
  columnType : ColumnTypeLiteral
  column : string, // required to fetch entries
  table : string, // required to fetch entries for select dropdown
  columnAlias : string, // required for HAVING clause of the query
  filterType : 'search' | 'select' | 'range',
};
