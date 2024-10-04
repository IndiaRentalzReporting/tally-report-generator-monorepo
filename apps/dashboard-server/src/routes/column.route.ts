import { validateSchema } from '@trg_package/middlewares';
import { Router } from 'express';
import { TableSelectSchema } from '@trg_package/schemas-reporting/types';
import z from 'zod';
import { readAll } from '../controller/column.controller';

const columnRouter = Router();

columnRouter.get(
  '/read/:tableId',
  validateSchema({
    params: z.object({
      tableId: TableSelectSchema.shape.id
    })
  }),
  readAll
);

export default columnRouter;
