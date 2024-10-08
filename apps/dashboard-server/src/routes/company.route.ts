import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  CompanyInsertSchema,
  GroupInsertSchema,
  LedgerInsertSchema,
  StockCategoryInsertSchema,
  StockGroupInsertSchema,
  StockItemInsertSchema
} from '@trg_package/schemas-tally/types';
import z from 'zod';
import { decryptApiKey } from '@/middlewares';
import { createOne, readAll, syncData } from '@/controller/company.controller';

const companyRouter = Router();

companyRouter.use(decryptApiKey);

companyRouter.post(
  '/create',
  validateSchema({
    body: CompanyInsertSchema
  }),
  createOne
);

companyRouter.get(
  '/read',
  validateSchema({
    query: CompanyInsertSchema.partial()
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
        ledger: z.array(LedgerInsertSchema.strict())
      })
      .partial(),

    params: CompanyInsertSchema.pick({ guid: true })
  }),
  syncData
);

export default companyRouter;
