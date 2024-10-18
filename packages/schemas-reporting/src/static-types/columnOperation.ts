import { ColumnTypeLiteral } from '@/types';

export const ColumnOperations = {
  COUNT: null ,
  MAX: null ,
  MIN: null ,
  SUM: null ,
  AVG: null,

} as const;

export type ColumnOperators = keyof typeof ColumnOperations;

export const StaticColumnOperators: {
  [X in ColumnTypeLiteral]: Array<ColumnOperators>
} = {
  id: [],
  string: [
    'COUNT',
    'MAX',
    'MIN'
  ],
  number: [
    'COUNT',
    'MAX',
    'MIN',
    'SUM',
    'AVG'
  ],
  date: [
    'COUNT',
    'MAX',
    'MIN'
  ],
  foreignKey: []
};
