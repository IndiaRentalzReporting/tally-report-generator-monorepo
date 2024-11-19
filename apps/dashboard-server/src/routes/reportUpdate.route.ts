import { validateSchema } from '@trg_package/middlewares';
import { ReportAccessInsertSchema, ReportExportScheduleInsertSchema, ReportSelectSchema } from '@trg_package/schemas-reporting/types';
import { Router } from 'express';
import z from 'zod';
import { updateAccess, updateOne, updateSchedule } from '@/controller/report.controller';
import { validateReport } from '@/middlewares/validateReport';

const reportUpdateRouter = Router();

reportUpdateRouter.patch(
  '/:id',
  validateSchema({
    body: ReportSelectSchema.partial(),
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  validateReport,
  updateOne
);
reportUpdateRouter.patch(
  '/access/:id',
  validateSchema({
    body: z.object({
      users: z.array(ReportAccessInsertSchema.shape.userId)
    }).strict(),
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  updateAccess
);

reportUpdateRouter.patch(
  '/schedule/:id',
  validateSchema({
    body: z.object({
      schedule: ReportExportScheduleInsertSchema.omit({ reportId: true,nextRun: true })
        .refine((schedule) => {
          if (schedule.frequency === 'custom' && !schedule.customInterval) {
            return false;
          }
          return true;
        },{ message: 'Custom Interval is required for custom frequency' }),
    }).partial(),
    params: ReportSelectSchema.pick({
      id: true
    })
  }),
  updateSchedule
);

export default reportUpdateRouter;
