import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  ReportInsertSchema,
  ReportSelectSchema,
  TableSelectSchema
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

reportRouter.get(
  '/read/getColumns/:tableId',
  validateSchema({
    params: z.object({
      tableId: TableSelectSchema.shape.id
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
      name: true,
      queryConfig: true,
      id: true
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

// report level access pending
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
