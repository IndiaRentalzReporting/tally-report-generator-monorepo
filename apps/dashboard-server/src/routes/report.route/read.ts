import { validateSchema } from '@trg_package/middlewares';
import {
  ColumnInsertSchema,
  FilterValueSchema,
  ReportInsertSchema,
  ReportSelectSchema,
  TableSelectSchema
} from '@trg_package/schemas-reporting/types';
import { Router } from 'express';
import z from 'zod';
import {
  getAllColumns,
  getAllTables,
  getReportColumns,
  getReportData,
  getReportFilters,
  getSelectData,
  getUsersWithAccess,
  readAll
} from '@/controller/report.controller/read';

const reportReadRouter = Router();

reportReadRouter.get(
  '/',
  validateSchema({
    query: ReportSelectSchema.partial()
  }),
  readAll
);

reportReadRouter.get(
  '/columns/:tableId',
  validateSchema({
    params: z.object({
      tableId: TableSelectSchema.shape.id
    })
  }),
  getAllColumns
);

reportReadRouter.get(
  '/tables',
  getAllTables,
);

// report level access pending
reportReadRouter.get(
  '/selectData/:id',
  validateSchema({
    params: ColumnInsertSchema.pick({
      id: true
    })
  }),
  getSelectData
);

reportReadRouter.get(
  '/reportColumns/:id',
  validateSchema({
    params: ReportInsertSchema.pick({
      id: true
    })
  }),
  getReportColumns
);

reportReadRouter.get(
  '/reportData/:id',
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

reportReadRouter.get(
  '/reportFilters/:id',
  validateSchema({
    params: ReportInsertSchema.pick({
      id: true
    })
  }),
  getReportFilters
);

reportReadRouter.get(
  '/usersWithAccess/:id',
  validateSchema({
    params: ReportInsertSchema.pick({
      id: true
    })
  }),
  getUsersWithAccess
);

export default reportReadRouter;
