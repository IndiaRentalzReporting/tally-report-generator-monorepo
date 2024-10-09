import { ColumnTypeLiteral } from './ColumnTypes';

export type Operation = {
  operationType: string;
  operationParams: string[];
};

export const ColumnOperation: {
  [k in ColumnTypeLiteral]: Operation[];
} = {
  id: [
    {
      operationType: 'COUNT',
      operationParams: []
    }
  ],
  string: [
    {
      operationType: 'COUNT',
      operationParams: []
    },
    {
      operationType: 'MAX',
      operationParams: []
    },
    {
      operationType: 'MIN',
      operationParams: []
    }
  ],
  number: [
    {
      operationType: 'COUNT',
      operationParams: []
    },
    {
      operationType: 'MAX',
      operationParams: []
    },
    {
      operationType: 'MIN',
      operationParams: []
    },
    {
      operationType: 'SUM',
      operationParams: []
    },
    {
      operationType: 'AVG',
      operationParams: []
    }
  ],
  date: [
    {
      operationType: 'COUNT',
      operationParams: []
    },
    {
      operationType: 'MAX',
      operationParams: []
    },
    {
      operationType: 'MIN',
      operationParams: []
    },
    {
      operationType: 'AGE',
      operationParams: ['date1', 'date2']
    }
  ],
  foreignKey: []
};
