import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';
import { timestamp } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';

export const TenantSchema = pgTable('tenants', {
  ...BaseEntitySchema,
  name: BaseEntitySchema.name.unique(),
  lastSyncedAt: timestamp('lastSyncedAt').defaultNow(),
  db_name: varchar('db_name', { length: 128 }).notNull(),
  db_username: varchar('db_username', { length: 128 }).notNull(),
  db_password: varchar('db_password', { length: 128 }).notNull()
});

export type TenantInsert = typeof TenantSchema.$inferInsert;
export const TenantInsertSchema = createInsertSchema(TenantSchema);
export type TenantSelect = typeof TenantSchema.$inferSelect;
export const TenantSelectSchema = createSelectSchema(TenantSchema);
