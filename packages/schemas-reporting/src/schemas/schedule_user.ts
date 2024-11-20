import {
  uuid, pgTable, pgEnum
} from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { UserSchema } from '@trg_package/schemas-dashboard/schemas';
import { ScheduleSchema } from './schedule';

export const ExportFrequency = pgEnum('exportFrequency', [
  'daily',
  'weekly',
  'monthly',
  'custom'
]);

export const ScheduleUserSchema = pgTable('schedule_user', {
  id: uuid('id').primaryKey().defaultRandom(),
  scheduleId: uuid('scheduleId')
    .references(() => ScheduleSchema.id, {
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

export type ScheduleUserInsert = typeof ScheduleUserSchema.$inferInsert;
export const ScheduleUserInsertSchema = createInsertSchema(ScheduleUserSchema);
export type ScheduleUserSelect = typeof ScheduleUserSchema.$inferSelect;
export const ScheduleUserSelectSchema = createSelectSchema(ScheduleUserSchema);
