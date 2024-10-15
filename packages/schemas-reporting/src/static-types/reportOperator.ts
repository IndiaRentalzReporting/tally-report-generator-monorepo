import { ColumnTypeLiteral } from './column';

export type OperatorType = { operator: string; params: string[] };

export type ColumnOperators = {
  [key in ColumnTypeLiteral]: OperatorType[];
};
