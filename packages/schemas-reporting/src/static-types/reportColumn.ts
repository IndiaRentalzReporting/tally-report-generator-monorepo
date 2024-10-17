import { ColumnSelect } from './column';
import { ColumnFormats } from './reportFormat';
import { ColumnOperation } from './reportOperation';

// Select table.name as alias
// Select Operation(table.name) as alias
// Select FORMAT(table.name) as alias
export type ReportColumnInsert = {
  column: ColumnSelect;
  heading: string;
  operation: ColumnOperation[ReportColumnInsert['column']['type']] | null;
  format: ColumnFormats[ReportColumnInsert['column']['type']] | null;
};

export type ReportColumnSelect = {
  alias: string; // Use this as response key
  heading: string; // Use this as table column heading
};
