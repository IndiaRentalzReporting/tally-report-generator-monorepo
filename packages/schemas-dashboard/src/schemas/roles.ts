import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';

export const RoleSchema = pgTable('roles', {
  ...BaseEntitySchema()
});

export type RoleInsert = typeof RoleSchema.$inferInsert;
export const RoleInsertSchema = createInsertSchema(RoleSchema);
export type RoleSelect = typeof RoleSchema.$inferSelect;
export const RoleSelectSchema = createSelectSchema(RoleSchema);
