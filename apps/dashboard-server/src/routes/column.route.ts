import { validateSchema } from '@trg_package/middlewares';
import { Router } from 'express';
import { ColumnInsertSchema } from '@trg_package/schemas-reporting/types';
import { readAll } from '../controller/column.controller';

const columnRouter = Router();

columnRouter.get(
  '/read/:tableId',
  validateSchema({
    query: ColumnInsertSchema.partial(),
    params: ColumnInsertSchema.pick({ tableId: true })
  }),
  readAll
);

export default columnRouter;
