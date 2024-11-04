import z from 'zod';
import { DetailedColumnSelect } from '../../types';
import { DetailedColumnInsertSchema } from '../../types/column';

export const FilterOperations = {
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

export type FilterTypes = keyof typeof FilterOperations;

export const ReportFilterInsertSchema = z.object({
  column: DetailedColumnInsertSchema,
  filterType: z.enum(['default','search','select'])
});

export type ReportFilterInsert = {
  column: DetailedColumnSelect,
  filterType : FilterTypes,
  conditionType : 'having' | undefined,
  columnName : string | undefined

};

export type ReportFilterSelect = {
  column : DetailedColumnSelect,
  filterType : FilterTypes,
  conditionType : 'having' | undefined,
  columnName : string | undefined
};

export type ReportFilterConfig = {
  [K : DetailedColumnSelect['alias']] : {
    filterType : FilterTypes,
    dataSource : string | null,
    heading : DetailedColumnSelect['heading']
    queryCondition : string,
    conditionType : 'where' | 'having'
  }
};
