import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from '@trg_package/schemas-base/schemas';

export const CompanySchema = pgTable('companies', {
  ...BaseEntitySchema
});

export type CompanyInsert = typeof CompanySchema.$inferInsert;
export const CompanyInsertSchema = createInsertSchema(CompanySchema);
export type CompanySelect = typeof CompanySchema.$inferSelect;
export const CompanySelectSchema = createSelectSchema(CompanySchema);
