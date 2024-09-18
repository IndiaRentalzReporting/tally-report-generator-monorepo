import {
  GroupSchema,
  GroupTempSchema,
  LedgerSchema,
  LedgerTempSchema,
  StockCategorySchema,
  StockCategoryTempSchema,
  StockGroupSchema,
  StockGroupTempSchema,
  StockItemSchema,
  StockItemTempSchema
} from '@trg_package/schemas-tally/schemas';
import {
  GroupInsert,
  LedgerInsert,
  StockCategoryInsert,
  StockGroupInsert,
  StockItemInsert
} from '@trg_package/schemas-tally/types';

export const TallySchemas = {
  group: {
    schema: GroupSchema,
    tempSchema: GroupTempSchema
  },
  stockCategory: {
    schema: StockCategorySchema,
    tempSchema: StockCategoryTempSchema
  },
  stockGroup: {
    schema: StockGroupSchema,
    tempSchema: StockGroupTempSchema
  },
  stockItem: {
    schema: StockItemSchema,
    tempSchema: StockItemTempSchema
  },
  ledger: {
    schema: LedgerSchema,
    tempSchema: LedgerTempSchema
  }
};

export type TallyTypes = {
  ledger: LedgerInsert;
  group: GroupInsert;
  stockCategory: StockCategoryInsert;
  stockItem: StockItemInsert;
  stockGroup: StockGroupInsert;
};
