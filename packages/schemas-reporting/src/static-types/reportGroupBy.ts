import { DetailedColumnSelect } from '../types';

/**
 * GROUP BY {columnName}
 */
export type ReportGroupByInsert = {
  column: DetailedColumnSelect;
};

export type ReportGroupBySelect = {
  column: DetailedColumnSelect;
};
