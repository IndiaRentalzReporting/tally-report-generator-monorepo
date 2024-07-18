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

export const ModuleSchema = pgTable('modules', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  isPrivate: boolean('isPrivate').notNull().default(false),
  icon: text('icon'),
  createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
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
