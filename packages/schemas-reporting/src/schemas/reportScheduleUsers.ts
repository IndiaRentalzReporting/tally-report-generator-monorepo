import {
  uuid, pgTable, pgEnum
} from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { UserSchema } from '@trg_package/schemas-dashboard/schemas';
import { ReportExportScheduleSchema } from './reportExportSchedule';

export const ExportFrequency = pgEnum('exportFrequency', [
  'daily',
  'weekly',
  'monthly',
  'custom'
]);

export const ReportScheduleUsersSchema = pgTable('reportScheduleUsers', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleId: uuid('scheduleId')
    .references(() => ReportExportScheduleSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .notNull(),
  userId: uuid('userId')
    .references(() => UserSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .notNull(),
});

export type ReportScheduleUsersInsert = typeof ReportScheduleUsersSchema.$inferInsert;
export const ReportScheduleUsersInsertSchema = createInsertSchema(ReportScheduleUsersSchema);
export type ReportScheduleUsersSelect = typeof ReportScheduleUsersSchema.$inferSelect;
export const ReportScheduleUsersSelectSchema = createSelectSchema(ReportScheduleUsersSchema);
