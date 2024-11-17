import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';

export const ActionSchema = pgTable('actions', {
  ...BaseEntitySchema()
});

export type ActionInsert = typeof ActionSchema.$inferInsert;
export const ActionInsertSchema = createInsertSchema(ActionSchema);
export type ActionSelect = typeof ActionSchema.$inferSelect;
export const ActionSelectSchema = createSelectSchema(ActionSchema);
