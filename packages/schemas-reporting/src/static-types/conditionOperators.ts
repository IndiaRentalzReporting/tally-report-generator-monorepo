export const ConditionOperations = {
  LIKE: {
    params: { value: 'string' },
    for: ['string']
  },
  ILIKE: {
    params: { value: 'string' },
    for: ['string']
  },
  BETWEEN: {
    params: {
      from: 'string',
      to: 'string',
    },
    for: ['number', 'date']
  },
  '<': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '<=': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '>': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '>=': {
    params: { value: 'string' },
    for: ['number', 'date']
  },
  '=': {
    params: { value: 'string' },
    for: ['string', 'number', 'date']
  },
  IN: {
    params: { value: ['string'] },
    for: ['string', 'date']
  },
  '!=': {
    params: { value: 'string' },
    for: ['string', 'number', 'date']
  },
  'IS NULL': {
    params: null,
    for: ['string', 'number', 'date']
  },
  'IS NOT NULL': {
    params: null,
    for: ['string', 'number', 'date']
  },
};

export type ConditionOperators = keyof typeof ConditionOperations;
