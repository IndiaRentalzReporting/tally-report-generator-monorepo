import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

const actionName = pgEnum('actionName', ['create', 'read', 'update', 'delete']);
export const ActionSchema = pgTable('action', {
  id: uuid('id').defaultRandom().notNull().primaryKey(),
  name: actionName('name').notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type ActionInsert = typeof ActionSchema.$inferInsert;
export type ActionSelect = typeof ActionSchema.$inferSelect;
