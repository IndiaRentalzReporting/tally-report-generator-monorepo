import { ColumnSelect } from './column';

/**
 * GROUP BY {columnName}
 */
export type ReportGroupByInsert = {
  column: ColumnSelect;
};

export type ReportGroupBySelect = {
  column: ColumnSelect;
};
