import { Router } from 'express';
import { validateSchema } from '@trg_package/middlewares';
import {
  ColumnInsertSchema,
  ReportSelectSchema,
  TableSelectSchema,
  ReportInsertSchema,
  FilterValueSchema
} from '@trg_package/schemas-reporting/types';
import z from 'zod';
import { validateReport } from '@/middlewares/validateReport';
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
    body: ReportSelectSchema.partial(),
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
    }),
    query: z.object({
      pageSize: z.coerce.number(),
      pageIndex: z.coerce.number(),
      filters: z.optional(
        z.string().refine((val) => {
          try {
            const parsed = JSON.parse(val);
            return typeof parsed === 'object' && !Array.isArray(parsed);
          } catch {
            return false;
          }
        }, {
          message: 'filters must be a valid JSON object',
        })
          .transform((val) => JSON.parse(val))
          .refine(
            (filters) => Object
              .values(filters)
              .every((item) => FilterValueSchema.safeParse(item).success),
            {
              message: 'Each filter must be of type { value: string | string[] } or { from: string, to: string }',
            }
          )
      )
    }).strict()
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
