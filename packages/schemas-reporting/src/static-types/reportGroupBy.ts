import { ColumnSelect } from '../types';

/**
 * GROUP BY {columnName}
 */
export type ReportGroupByInsert = {
  column: ColumnSelect;
};

export type ReportGroupBySelect = {
  column: ColumnSelect;
};
