import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';

export const ApiKeySchema = pgTable('apiKeys', {
  ...BaseEntitySchema(),
  key: text('key').unique().notNull()
});

export type ApiKeyInsert = typeof ApiKeySchema.$inferInsert;
export const ApiKeyInsertSchema = createInsertSchema(ApiKeySchema);
export type ApiKeySelect = typeof ApiKeySchema.$inferSelect;
export const ApiKeySelectSchema = createInsertSchema(ApiKeySchema);
