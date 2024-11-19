import { uuid, pgTable } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { UserSchema } from '@trg_package/schemas-dashboard/schemas';
import { ReportSchema } from './reports';

export const ReportAccessSchema = pgTable('reportAccess', {
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

export type ReportAccessInsert = typeof ReportAccessSchema.$inferInsert;
export const ReportAccessInsertSchema = createInsertSchema(ReportAccessSchema);
export type ReportAccessSelect = typeof ReportAccessSchema.$inferSelect;
export const ReportAccessSelectSchema = createSelectSchema(ReportAccessSchema);
