import { varchar , uuid , pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const TableSchema = pgTable('tables', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).unique().notNull(),
  displayName: varchar('displayName').notNull()
});

export type TableInsert = typeof TableSchema.$inferInsert;
export const TableInsertSchema = createInsertSchema(TableSchema);
export type TableSelect = typeof TableSchema.$inferSelect;
export const TableSelectSchema = createSelectSchema(TableSchema);
