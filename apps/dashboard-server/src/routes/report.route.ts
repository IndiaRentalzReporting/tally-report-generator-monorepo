import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  ColumnInsertSchema,
  ReportInsertSchema,
  ReportSelectSchema,
  TableSelectSchema
} from '@trg_package/schemas-reporting/types';
import {
  createOne,
  deleteOne,
  getColumns,
  getTables,
  readAll,
  updateOne
} from '../controller/report.controller';

const reportRouter = Router();

reportRouter.post(
  '/create',
  validateSchema({
    body: ReportInsertSchema.pick({
      name: true,
      baseEntity: true,
      description: true
    })
  }),
  createOne
);

reportRouter.get(
  '/read',
  validateSchema({
    query: ReportSelectSchema.partial()
  }),
  readAll
);

reportRouter.patch(
  '/update/:id',
  validateSchema({
    body: ReportInsertSchema,
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  updateOne
);

reportRouter.delete(
  '/delete/:id',
  validateSchema({
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  deleteOne
);

reportRouter.get(
  '/read/getColumns/:tableId',
  validateSchema({
    query: ColumnInsertSchema.partial(),
    params: ColumnInsertSchema.pick({ tableId: true })
  }),
  getColumns
);

reportRouter.get(
  '/read/getTables',
  validateSchema({
    query: TableSelectSchema.partial()
  }),
  getTables
);

export default reportRouter;
