export const FilterOptions = {
  select: {
    for: ['string']
  },
  search: {
    for: ['string']
  },
  default: {
    for: ['number','date']
  }
};

export type FilterTypes = keyof typeof FilterOptions;
