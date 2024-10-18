export type ConditionOperations = {
  LIKE: {
    value: string
  },
  ILIKE: {
    value: string
  },
  BETWEEN: {
    from: string,
    to: string
  },
  '<': {
    value: string
  },
  '<=': {
    value: string
  },
  '>': {
    value: string
  },
  '>=': {
    value: string
  },
  '=': {
    value: string
  },
  IN: {
    value: Array<string>
  },
  '!=': {
    value: string
  },
  'IS NULL': null,
  'IS NOT NULL': null,
};

export type ConditionOperator = keyof ConditionOperations;
