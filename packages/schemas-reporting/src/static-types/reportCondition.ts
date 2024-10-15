import { OperatorType } from './reportOperator';
import { ColumnSelect } from './column';

// WHERE  {JOIN} {table}.{column}  {operator} {value}
// WHERE table.name like "%abc"
// WHERE table.name between (from,to)
export type ConditionInsert = {
  column: ColumnSelect;
  operator: OperatorType;
  value: string[];
  join: 'AND' | 'OR' | 'AND NOT' | 'OR NOT';
};

export type ConditionSelect = {
  column: ColumnSelect;
  operator: OperatorType;
  value: string[];
  join: 'AND' | 'OR' | 'AND NOT' | 'OR NOT';
};
