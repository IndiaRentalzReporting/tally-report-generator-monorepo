import { relations } from 'drizzle-orm';
import { UserSchema } from '@trg_package/schemas-dashboard/schemas';
import { ReportSchema } from './reports';
import { ReportAccessSchema } from './reportAccess';
import { ReportExportScheduleSchema } from './reportExportSchedule';

export const ReportAccessRelations = relations(
  ReportAccessSchema,
  ({ one }) => ({
    user: one(UserSchema,{
      fields: [ReportAccessSchema.userId],
      references: [UserSchema.id]
    }),
    report: one(ReportSchema,{
      fields: [ReportAccessSchema.reportId],
      references: [ReportSchema.id]
    })
  })
);

export const ReportScheduleRelations = relations(
  ReportExportScheduleSchema,
  ({ one }) => ({
    report: one(ReportSchema,{
      fields: [ReportExportScheduleSchema.reportId],
      references: [ReportSchema.id]
    })
  })
);
export const ReportRelations = relations(
  ReportSchema,
  ({ one,many }) => ({
    access: many(ReportAccessSchema),
    schedule: one(ReportExportScheduleSchema)
  })
);
