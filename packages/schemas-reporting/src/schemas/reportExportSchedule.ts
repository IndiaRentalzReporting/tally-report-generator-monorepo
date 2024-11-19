import {
  varchar, uuid, pgTable, pgEnum, json,
  timestamp , time , integer
} from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { ReportSchema } from './reports';

export const ExportFrequency = pgEnum('exportFrequency', [
  'daily',
  'weekly',
  'monthly',
  'custom'
]);

export const ReportExportScheduleSchema = pgTable('ReportExportSchedule', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('reportId')
    .references(() => ReportSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    .notNull(),
  email: varchar('email',{ length: 512 }).notNull(),
  frequency: ExportFrequency('frequency').notNull(),
  timeOfDay: time('time_of_day').default('00:00:00').notNull(),
  daysOfWeek: json('daysOfWeek').$type<number[]>().default([1, 2, 3, 4, 5, 6, 7]),
  daysOfMonth: json('daysOfMonth').$type<number[]>().default([1]).notNull(),
  customInterval: integer('customInterval'),
  nextRun: timestamp('next_run').notNull(), // Calculate dynamically
});

export type ReportExportScheduleInsert = typeof ReportExportScheduleSchema.$inferInsert;
export const ReportExportScheduleInsertSchema = createInsertSchema(ReportExportScheduleSchema);
export type ReportExportScheduleSelect = typeof ReportExportScheduleSchema.$inferSelect;
export const ReportExportScheduleSelectSchema = createSelectSchema(ReportExportScheduleSchema);
