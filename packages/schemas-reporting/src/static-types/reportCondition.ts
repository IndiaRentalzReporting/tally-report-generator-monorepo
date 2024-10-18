import { DetailedColumnSelect } from '../types';
import { ConditionOperator, ConditionParams } from './conditionOperators';

// WHERE  {JOIN} {table}.{column}  {operator} {value}
// WHERE table.name like "%abc"
// WHERE table.name between (from,to)
export type ReportConditionInsert = {
  column : DetailedColumnSelect,
  operator : ConditionOperator,
  params : ConditionParams<ReportConditionInsert['column']['type']>,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};

export type ReportConditionSelect = {
  column : DetailedColumnSelect,
  operator : ConditionOperator,
  params : ConditionParams<ReportConditionInsert['column']['type']>,
  join : 'AND' | 'OR' | 'AND NOT' | 'OR NOT'
};
