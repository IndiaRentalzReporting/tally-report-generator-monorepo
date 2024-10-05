import { OperatorType } from './reportOperator';
import { ReportColumnInsert } from './reportColumn';

// WHERE  {JOIN} {table}.{column}  {operator} {value}
// WHERE table.name like "%abc"
// WHERE table.name between (from,to)
export type ConditionInsert = {
  column : Pick<ReportColumnInsert, 'alias'>,
  table : Pick<ReportColumnInsert, 'table'>,
  operator :OperatorType,
  value : string[],
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};

export type ConditionSelect = {
  column : Pick<ReportColumnInsert, 'alias'>,
  table : Pick<ReportColumnInsert, 'table'>,
  operator :OperatorType,
  value : string[],
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};
