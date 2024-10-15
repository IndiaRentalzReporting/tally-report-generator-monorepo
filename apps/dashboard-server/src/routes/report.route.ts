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
  getAllColumns,
  getAllTables,
  getColumns,
  getTables,
  readAll,
  updateOne
} from '../controller/report.controller';
import z from 'zod';

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

reportRouter.get('/read', readAll);


reportRouter.get(
    '/read/getColumns/:tableId',
    validateSchema({
        params: z.object({
            tableId : TableSelectSchema.shape.id
        })
    }),
    getAllColumns
);

reportRouter.get(
    '/read/getTables',
    getAllTables,
);



reportRouter.patch(
  '/update/:id',
  validateSchema({
    body: ReportInsertSchema.omit({
      baseEntity: true,
      name:true
    }),
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
