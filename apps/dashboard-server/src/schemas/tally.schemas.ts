import { GroupService, LedgerService, StockCategoryService, StockGroupService, StockItemService } from '@trg_package/schemas-tally/services';
import {
  GroupInsert,
  LedgerInsert,
  StockCategoryInsert,
  StockGroupInsert,
  StockItemInsert
} from '@trg_package/schemas-tally/types';

export const TallyServices = {
  group: GroupService,
  stockCategory: StockCategoryService,
  stockGroup: StockGroupService,
  stockItem: StockItemService,
  ledger: LedgerService
};

export type TallyTypes = {
  ledger: LedgerInsert;
  group: GroupInsert;
  stockCategory: StockCategoryInsert;
  stockItem: StockItemInsert;
  stockGroup: StockGroupInsert;
};
