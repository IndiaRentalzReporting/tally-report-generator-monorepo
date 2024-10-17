import { ColumnTypeLiteral } from '../types';
import { Operation } from './reportOperation';

export type ColumnFormats = {
  [k in ColumnTypeLiteral]: Operation[];
};
