import { ColumnTypeLiteral } from '../types';

export type Operation = {
  operationType: string;
  operationParams: string[];
};

export type ColumnOperation = {
  [k in ColumnTypeLiteral]: Operation[];
};
