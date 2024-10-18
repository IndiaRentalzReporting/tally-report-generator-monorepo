import { DetailedColumnSelect } from '../types';

// Select table.name as alias
// Select Operation(table.name) as alias
// Select FORMAT(table.name) as alias
export type ReportColumnInsert = {
  column: DetailedColumnSelect,
  heading: string,
  operation: string;
};

export type ReportColumnSelect = {
  alias: string; // Use this as response key
  heading: string; // Use this as table column heading
};
