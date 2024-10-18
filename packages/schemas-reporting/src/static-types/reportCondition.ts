import { DetailedColumnSelect } from '../types';
import { ConditionOperations, ConditionOperator } from './conditionOperators';

export type ConditionOperation<T extends ConditionOperator> = {
  operator: T;
  params: ConditionOperations[T];
};

// WHERE  {JOIN} {table}.{column}  {operator} {value}
// WHERE table.name like "%abc"
// WHERE table.name between (from,to)
export type ReportConditionInsert = {
  [K in ConditionOperator]: ConditionOperation<K>
}[ConditionOperator] & {
  column : DetailedColumnSelect,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};

export type ReportConditionSelect = {
  [K in ConditionOperator]: ConditionOperation<K>
}[ConditionOperator] & {
  column : DetailedColumnSelect,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};
