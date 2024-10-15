import { ColumnTypeLiteral } from './column';
import { Operation } from './reportOperation';

export type ColumnFormats = {
  [k in ColumnTypeLiteral]: Operation[];
};
