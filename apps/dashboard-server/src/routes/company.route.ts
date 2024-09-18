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
import {
  createOne,
  readAll,
  readOne,
  syncData
} from '../controller/company.controller';
import z, { any, AnyZodObject, ZodArray } from 'zod';

const companyRouter = Router();

companyRouter.post(
  '/create',
  validateSchema({
    body: CompanyInsertSchema
  }),
  createOne
);

companyRouter.get('/read', readAll);
companyRouter.get(
  '/verify/:guid',
  validateSchema({
    params: CompanyInsertSchema.pick({ guid: true })
  }),
  readOne
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
