export const ColumnOperations = {
  COUNT: {
    params: { value: null },
    for: ['string', 'number', 'date']
  },
  MAX: {
    params: { value: null },
    for: ['string', 'number', 'date']
  },
  MIN: {
    params: { value: null },
    for: ['string', 'number', 'date']
  },
  SUM: {
    params: { value: null },
    for: ['number']
  },
  AVG: {
    params: { value: null },
    for: ['number']
  }
};

export type ColumnOperators = keyof typeof ColumnOperations;
