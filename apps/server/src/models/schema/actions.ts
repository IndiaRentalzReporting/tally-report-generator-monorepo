import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const name = pgEnum('name', [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'IMPORT',
  'EXPORT'
]);
export const ActionSchema = pgTable('actions', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  name: name('name').notNull().unique(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type ActionInsert = typeof ActionSchema.$inferInsert;
export const ActionInsertSchema = createInsertSchema(ActionSchema);
export type ActionSelect = typeof ActionSchema.$inferSelect;
export const ActionSelectSchema = createSelectSchema(ActionSchema);
