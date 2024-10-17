import { ColumnTypeLiteral } from './column';

export type Operation = {
  operationType: string;
  operationParams: string[];
};

export type ColumnOperation = {
  [k in ColumnTypeLiteral]: Operation[];
};
