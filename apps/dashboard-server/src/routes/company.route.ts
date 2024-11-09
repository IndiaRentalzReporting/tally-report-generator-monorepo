import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  CompanyInsertSchema,
  GroupInsertSchema,
  LedgerInsertSchema,
  StockCategoryInsertSchema,
  StockGroupInsertSchema,
  StockItemInsertSchema,
  UnitInsertSchema,
  VoucherInsertSchema,
  InventoryVoucherInsertSchema,
  CompanySelectSchema
} from '@trg_package/schemas-tally/types';
import z from 'zod';
import { attachPGDashboard, attachServices, decryptApiKey } from '@/middlewares';
import { createOne, readAll, syncData } from '@/controller/company.controller';

const companyRouter = Router();

companyRouter.use(decryptApiKey);
companyRouter.use(attachPGDashboard);
companyRouter.use(attachServices);

companyRouter.post(
  '/create',
  validateSchema({
    body: CompanyInsertSchema.pick({
      name: true,
      guid: true,
      masterId: true,
      alterId: true
    })
  }),
  createOne
);

companyRouter.get(
  '/read',
  validateSchema({
    query: CompanySelectSchema.partial()
  }),
  readAll
);

companyRouter.post(
  '/sync/:guid',
  validateSchema({
    body: z
      .object({
        group: z.array(GroupInsertSchema.strict()),
        stockCategory: z.array(StockCategoryInsertSchema.strict()),
        stockGroup: z.array(StockGroupInsertSchema.strict()),
        stockItem: z.array(StockItemInsertSchema.strict()),
        ledger: z.array(LedgerInsertSchema.strict()),
        unit: z.array(UnitInsertSchema.strict()),
        voucher: z.array(VoucherInsertSchema.strict()),
        inventoryVoucher: z.array(InventoryVoucherInsertSchema.strict()),
      })
      .partial(),
    params: CompanyInsertSchema.pick({ guid: true })
  }),
  syncData
);

export default companyRouter;
