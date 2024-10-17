import { ColumnTypeLiteral } from '../types';

export type OperatorType = { operator: string; params: string[] };

export type ColumnOperators = {
  [key in ColumnTypeLiteral]: OperatorType[];
};
