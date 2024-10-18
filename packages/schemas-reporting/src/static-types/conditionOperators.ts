import { ColumnTypeLiteral } from '../types/Column';

export type ConditionOperator = string;

export type ConditionParams<
  T extends ColumnTypeLiteral
> =
 null | { value : T | T[] } | { from: T , to : T };
