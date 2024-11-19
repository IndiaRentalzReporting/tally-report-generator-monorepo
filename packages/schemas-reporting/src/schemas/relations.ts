import { relations } from 'drizzle-orm';
import { UserSchema } from '@trg_package/schemas-dashboard/schemas';
import { ReportSchema } from './reports';
import { ReportAccessSchema } from './reportAccess';
import { ReportExportScheduleSchema } from './reportExportSchedule';
import { ReportScheduleUsersSchema } from './reportScheduleUsers';

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
export const ReportScheduleUsersRelations = relations(
  ReportScheduleUsersSchema,
  ({ one }) => ({
    user: one(UserSchema,{
      fields: [ReportScheduleUsersSchema.userId],
      references: [UserSchema.id]
    }),
    schedule: one(ReportExportScheduleSchema,{
      fields: [ReportScheduleUsersSchema.scheduleId],
      references: [ReportExportScheduleSchema.id]
    })
  })
);

export const ReportScheduleRelations = relations(
  ReportExportScheduleSchema,
  ({ one,many }) => ({
    report: one(ReportSchema,{
      fields: [ReportExportScheduleSchema.reportId],
      references: [ReportSchema.id]
    }),
    users: many(ReportScheduleUsersSchema)
  })
);

export const ReportRelations = relations(
  ReportSchema,
  ({ one,many }) => ({
    access: many(ReportAccessSchema),
    schedule: one(ReportExportScheduleSchema)
  })
);
