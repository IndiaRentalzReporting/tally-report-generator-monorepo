import { uuid, pgTable } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { UserSchema } from '@trg_package/schemas-dashboard/schemas';
import { ReportSchema } from './reports';

export const ReportUserSchema = pgTable('report_user', {
  id: uuid('id').primaryKey().defaultRandom(),
  reportId: uuid('reportId')
    .references(() => ReportSchema.id, {
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

export type ReportUserInsert = typeof ReportUserSchema.$inferInsert;
export const ReportUserInsertSchema = createInsertSchema(ReportUserSchema);
export type ReportUserSelect = typeof ReportUserSchema.$inferSelect;
export const ReportUserSelectSchema = createSelectSchema(ReportUserSchema);
