import {
  text,
  boolean,
  varchar,
  timestamp,
  uuid,
  pgTable
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import * as z from 'zod';
import { BaseEntitySchema } from './baseEntitySchema';

export const ModuleSchema = pgTable('modules', {
  ...BaseEntitySchema,
  isPrivate: boolean('isPrivate').notNull().default(false),
  icon: text('icon')
});

export type ModuleInsert = typeof ModuleSchema.$inferInsert;
export const ModuleInsertSchema = createInsertSchema(ModuleSchema).merge(
  z.object({
    icon: z.optional(
      z
        .string()
        .startsWith('<svg xmlns="http://www.w3.org/2000/svg"')
        .endsWith('</svg>')
    )
  })
);
export type ModuleSelect = typeof ModuleSchema.$inferSelect;
export const ModuleSelectSchema = createSelectSchema(ModuleSchema);
