import { ColumnTypeLiteral } from './ColumnTypes';

export type OperatorType = { operator: string; params: string[] };

export type ColumnOperators = {
  [key in ColumnTypeLiteral]: OperatorType[];
};

export const Operators: ColumnOperators = {
  id: [],
  string: [
    {
      operator: '=',
      params: ['Value']
    },
    {
      operator: 'IN',
      params: ['Value']
    },
    {
      operator: '!=',
      params: ['Value']
    },
    {
      operator: 'IS NULL',
      params: []
    },
    {
      operator: 'IS NOT NULL',
      params: []
    },
    {
      operator: 'LIKE',
      params: ['Value']
    },
    {
      operator: 'ILIKE',
      params: ['Value']
    }
  ],
  number: [
    {
      operator: '=',
      params: ['Value']
    },
    {
      operator: 'IN',
      params: ['Value']
    },
    {
      operator: '!=',
      params: ['Value']
    },
    {
      operator: 'IS NULL',
      params: []
    },
    {
      operator: 'IS NOT NULL',
      params: []
    },
    {
      operator: '<',
      params: ['Value']
    },
    {
      operator: '<=',
      params: ['Value']
    },
    {
      operator: '>',
      params: ['Value']
    },
    {
      operator: '>=',
      params: ['Value']
    },
    {
      operator: 'BETWEEN',
      params: ['From', 'To']
    }
  ],
  date: [
    {
      operator: '<',
      params: ['Value']
    },
    {
      operator: '<=',
      params: ['Value']
    },
    {
      operator: '>',
      params: ['Value']
    },
    {
      operator: '>=',
      params: ['Value']
    },
    {
      operator: 'BETWEEN',
      params: ['From', 'To']
    },
    {
      operator: '=',
      params: ['Value']
    },
    {
      operator: 'IN',
      params: ['Value']
    },
    {
      operator: '!=',
      params: ['Value']
    },
    {
      operator: 'IS NULL',
      params: []
    },
    {
      operator: 'IS NOT NULL',
      params: []
    }
  ],
  foreignKey: []
};
