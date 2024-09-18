import * as Schemas from '@trg_package/schemas-tally/schemas';
import * as Types from '@trg_package/schemas-tally/types';

export const TallySchemas = {
  group: {
    schema: Schemas.GroupSchema,
    tempSchema: Schemas.GroupTempSchema
  },
  stockCategory: {
    schema: Schemas.StockCategorySchema,
    tempSchema: Schemas.StockCategoryTempSchema
  },
  stockGroup: {
    schema: Schemas.StockGroupSchema,
    tempSchema: Schemas.StockGroupTempSchema
  },
  stockItem: {
    schema: Schemas.StockItemSchema,
    tempSchema: Schemas.StockItemTempSchema
  },
  ledger: {
    schema: Schemas.LedgerSchema,
    tempSchema: Schemas.LedgerTempSchema
  }
};
export const TallyTypes = {
  ledger: Types.ledger,
  group: Types.group,
  stockCategory: Types.stock_category,
  stockItem: Types.stock_item,
  stockGroup: Types.stock_group
};
