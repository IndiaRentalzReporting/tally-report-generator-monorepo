export const FilterOptions = {
  select: {
    params: {
      value: ['string']
    },
    for: ['string']
  },
  search: {
    params: {
      value: 'string'
    },
    for: ['string']
  },
  between: {
    params: {
      from: 'string',
      to: 'string'
    },
    for: ['number','date']
  }
};

export type FilterTypes = keyof typeof FilterOptions;
