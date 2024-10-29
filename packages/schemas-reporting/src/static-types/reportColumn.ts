import { DetailedColumnSelect } from '../types';
import { ColumnOperators } from './columnOperation';

// Select table.name as alias
// Select Operation(table.name) as alias
// Select FORMAT(table.name) as alias
export type ReportColumnInsert = {
  column: DetailedColumnSelect,
  heading: string,
  operation: ColumnOperators | undefined;
};

export type ReportColumnSelect = {
  column: DetailedColumnSelect,
  heading: string,
  operation: ColumnOperators | undefined;
};

export type ReportColumnConfig = {
  alias : string,
  heading : string
};
