import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';

export const TenantSchema = pgTable('tenants', {
  ...BaseEntitySchema,
  name: BaseEntitySchema.name.unique()
});

export type TenantInsert = typeof TenantSchema.$inferInsert;
export const TenantInsertSchema = createInsertSchema(TenantSchema);
export type TenantSelect = typeof TenantSchema.$inferSelect;
export const TenantSelectSchema = createSelectSchema(TenantSchema);
