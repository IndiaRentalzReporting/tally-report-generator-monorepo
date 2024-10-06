import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import { TableSelectSchema } from '@trg_package/schemas-reporting/types';
import { readAll } from '../controller/table.controller';

const tableRouter = Router();

tableRouter.get(
  '/read',
  validateSchema({
    query: TableSelectSchema.partial()
  }),
  readAll
);

export default tableRouter;
