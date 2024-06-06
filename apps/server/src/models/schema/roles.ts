import { varchar, timestamp, pgTable, uuid } from 'drizzle-orm/pg-core';

export const RoleSchema = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type RoleInsert = typeof RoleSchema.$inferInsert;
export type RoleSelect = typeof RoleSchema.$inferSelect;
