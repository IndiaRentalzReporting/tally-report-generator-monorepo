import { text, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as z from 'zod';
import { BaseEntitySchema } from '@trg_package/schemas-base/schemas';

export const ModuleSchema = pgTable('modules', {
  ...BaseEntitySchema(),
  icon: text('icon').notNull()
});

export type ModuleInsert = typeof ModuleSchema.$inferInsert;
export const ModuleInsertSchema = createInsertSchema(ModuleSchema).extend({
  icon: z
    .string()
    .startsWith('<svg')
    .endsWith('</svg>')
});

export type ModuleSelect = typeof ModuleSchema.$inferSelect;
export const ModuleSelectSchema = createSelectSchema(ModuleSchema).extend({
  icon: z
    .string()
    .startsWith('<svg')
    .endsWith('</svg>')
});
