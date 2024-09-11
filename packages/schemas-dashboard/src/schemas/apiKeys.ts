import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { BaseEntitySchema } from './base';
import { createInsertSchema } from 'drizzle-zod';

export const ApiKeySchema = pgTable('apiKeys', {
  ...BaseEntitySchema,
  key: varchar('key', { length: 64 }).unique().notNull()
});

export type ApiKeyInsert = typeof ApiKeySchema.$inferInsert;
export const ApiKeyInsertSchema = createInsertSchema(ApiKeySchema);
export type ApiKeySelect = typeof ApiKeySchema.$inferSelect;
export const ApiKeySelectSchema = createInsertSchema(ApiKeySchema);
