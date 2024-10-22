import { DetailedColumnSelect } from '../types';
import { ConditionOperations, ConditionOperators } from './conditionOperators';

export type ConditionOperation<T extends ConditionOperators> = {
  operator: T;
  params: typeof ConditionOperations[T]['params'];
};

// WHERE  {JOIN} {table}.{column}  {operator} {value}
// WHERE table.name like "%abc"
// WHERE table.name between (from,to)
export type ReportConditionInsert = {
  [K in ConditionOperators]: ConditionOperation<K>
}[ConditionOperators] & {
  column : DetailedColumnSelect,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};

export type ReportConditionSelect = {
  [K in ConditionOperators]: ConditionOperation<K>
}[ConditionOperators] & {
  column : DetailedColumnSelect,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};
