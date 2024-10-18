import { ColumnTypeLiteral } from '@/types';

export const ConditionOperations = {
  LIKE: {
    value: 'string',
  },
  ILIKE: {
    value: 'string',
  },
  BETWEEN: {
    from: 'string',
    to: 'string',
  },
  '<': {
    value: 'string',
  },
  '<=': {
    value: 'string',
  },
  '>': {
    value: 'string',
  },
  '>=': {
    value: 'string',
  },
  '=': {
    value: 'string',
  },
  IN: {
    value: ['string'],
  },
  '!=': {
    value: 'string',
  },
  'IS NULL': null,
  'IS NOT NULL': null,
};

export type ConditionOperators = keyof typeof ConditionOperations;

export const StaticConditionOperators: {
  [X in ColumnTypeLiteral]: Array<ConditionOperators>
} = {
  id: [],
  string: [
    '=',
    'IN',
    '!=',
    'IS NULL',
    'IS NOT NULL',
    'LIKE',
    'ILIKE'

  ],
  number: [
    '=',
    'IN',
    '!=',
    'IS NULL',
    'IS NOT NULL',
    '<',
    '<=',
    '>',
    '>=',
    'BETWEEN'

  ],
  date: [
    '<',
    '<=',
    '>',
    '>=',
    'BETWEEN',
    '=',
    'IN',
    '!=',
    'IS NULL',
    'IS NOT NULL'
  ],
  foreignKey: []
};
