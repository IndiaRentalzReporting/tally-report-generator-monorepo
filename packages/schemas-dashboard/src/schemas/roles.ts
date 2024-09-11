import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';
import { uuid } from 'drizzle-orm/pg-core';
import { CompanySchema } from './companies';

export const RoleSchema = pgTable('roles', {
  ...BaseEntitySchema,
  company_id: uuid('company_id').references(() => CompanySchema.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade'
  })
});

export type RoleInsert = typeof RoleSchema.$inferInsert;
export const RoleInsertSchema = createInsertSchema(RoleSchema);
export type RoleSelect = typeof RoleSchema.$inferSelect;
export const RoleSelectSchema = createSelectSchema(RoleSchema);
