import {
  boolean,
  pgEnum,
  pgTable , timestamp , uuid, varchar
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const EntityStatus = pgEnum('status', [
  'deleted',
  'approved',
  'active',
  'inactive'
]);

export const TenantSchema = pgTable('tenants', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),

  name: varchar('name', { length: 200 }).notNull().unique(),
  db_name: varchar('db_name', { length: 128 }).unique(),
  db_username: varchar('db_username', { length: 128 }),
  db_password: varchar('db_password', { length: 128 }),

  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deletedAt'),
  approvedAt: timestamp('approvedAt'),
  lastSyncedAt: timestamp('lastSyncedAt').defaultNow(),

  status: EntityStatus('status').default('active').notNull(),
  isReadonly: boolean('isReadonly').notNull().default(false),
  isPrivate: boolean('isPrivate').notNull().default(false),
});

export type TenantInsert = typeof TenantSchema.$inferInsert;
export const TenantInsertSchema = createInsertSchema(TenantSchema);
export type TenantSelect = typeof TenantSchema.$inferSelect;
export const TenantSelectSchema = createSelectSchema(TenantSchema);
