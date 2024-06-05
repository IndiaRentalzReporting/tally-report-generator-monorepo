import { timestamp, pgTable, uuid, boolean } from 'drizzle-orm/pg-core';

export const PermissionSchema = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  can_create: boolean('can_create').default(false).notNull(),
  can_read: boolean('can_read').default(false).notNull(),
  can_update: boolean('can_update').default(false).notNull(),
  can_delete: boolean('can_delete').default(false).notNull(),
  can_import: boolean('can_import').default(false).notNull(),
  can_export: boolean('can_export').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});
