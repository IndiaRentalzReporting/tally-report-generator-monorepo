import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  ColumnInsertSchema,
  ReportSelectSchema,
  TableSelectSchema,
  ReportInsertSchema
} from '@trg_package/schemas-reporting/types';
import z from 'zod';
import {
  createOne,
  deleteOne,
  getAllColumns,
  getAllTables,
  getReportColumns,
  getReportData,
  getReportFilters,
  getSelectData,
  readAll,
  updateOne
} from '../controller/report.controller';
import { validateReport } from '@/middlewares/validateReport';

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
    body: ReportInsertSchema.omit({
      id: true,
      name: true,
      description: true,
      baseEntity: true
    }),
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  validateReport,
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
  '/read/columns/:tableId',
  validateSchema({
    params: z.object({
      tableId: TableSelectSchema.shape.id
    })
  }),
  getAllColumns
);

reportRouter.get(
  '/read/tables',
  getAllTables,
);

// report level access pending
reportRouter.get(
  '/read/selectData/:id',
  validateSchema({
    params: ColumnInsertSchema.pick({
      id: true
    })
  }),
  getSelectData
);

reportRouter.get(
  '/read/reportColumns/:id',
  validateSchema({
    params: ReportInsertSchema.pick({
      id: true
    })
  }),
  getReportColumns
);

reportRouter.get(
  '/read/reportData/:id',
  validateSchema({
    params: ReportInsertSchema.pick({
      id: true
    })
  }),
  getReportData
);

reportRouter.get(
  '/read/reportFilters/:id',
  validateSchema({
    params: ReportInsertSchema.pick({
      id: true
    })
  }),
  getReportFilters
);

export default reportRouter;
