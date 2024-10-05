/**
 * GROUP BY {columnName}
 */
export type ReportGroupByInsert = {
  column : string,
  table: string,
  alias: string
};

export type ReportGroupBySelect = {
  column : string,
  table: string,
  alias: string
};
