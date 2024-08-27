import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { BaseEntitySchema } from './base';
import { createInsertSchema } from 'drizzle-zod';

export const ApiKeysSchema = pgTable('api_keys', {
  ...BaseEntitySchema,
  key: varchar('key', { length: 64 }).unique().notNull()
});

export type ApiKeyInsert = typeof ApiKeysSchema.$inferInsert;
export const ApiKeyInsertSchema = createInsertSchema(ApiKeysSchema);
export type ApiKeySelect = typeof ApiKeysSchema.$inferSelect;
export const ApiKeySelectSchema = createInsertSchema(ApiKeysSchema);
