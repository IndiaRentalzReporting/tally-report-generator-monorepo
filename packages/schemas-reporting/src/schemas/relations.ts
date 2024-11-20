import { relations } from 'drizzle-orm';
import { UserSchema } from '@trg_package/schemas-dashboard/schemas';
import { ReportSchema } from './reports';
import { ReportUserSchema } from './report_user';
import { ScheduleSchema } from './schedule';
import { ScheduleUserSchema } from './schedule_user';

export const ReportAccessRelations = relations(
  ReportUserSchema,
  ({ one }) => ({
    user: one(UserSchema,{
      fields: [ReportUserSchema.userId],
      references: [UserSchema.id]
    }),
    report: one(ReportSchema,{
      fields: [ReportUserSchema.reportId],
      references: [ReportSchema.id]
    })
  })
);
export const ReportScheduleUsersRelations = relations(
  ScheduleUserSchema,
  ({ one }) => ({
    user: one(UserSchema,{
      fields: [ScheduleUserSchema.userId],
      references: [UserSchema.id]
    }),
    schedule: one(ScheduleSchema,{
      fields: [ScheduleUserSchema.scheduleId],
      references: [ScheduleSchema.id]
    })
  })
);

export const ReportScheduleRelations = relations(
  ScheduleSchema,
  ({ one,many }) => ({
    report: one(ReportSchema,{
      fields: [ScheduleSchema.reportId],
      references: [ReportSchema.id]
    }),
    users: many(ScheduleUserSchema)
  })
);

export const ReportRelations = relations(
  ReportSchema,
  ({ one,many }) => ({
    access: many(ReportUserSchema),
    schedule: one(ScheduleSchema)
  })
);
