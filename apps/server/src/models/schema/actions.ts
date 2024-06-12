import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

const name = pgEnum('name', ['create', 'read', 'update', 'delete']);
export const ActionSchema = pgTable('action', {
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
export type ActionSelect = typeof ActionSchema.$inferSelect;
