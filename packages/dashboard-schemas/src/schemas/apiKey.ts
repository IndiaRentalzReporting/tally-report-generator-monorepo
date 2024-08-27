import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { BaseEntitySchema } from './base';

export const ApiKeysSchema = pgTable('api_keys', {
  ...BaseEntitySchema,
  key: varchar('key', { length: 64 }).unique()
});

export type ApiKeyInsert = typeof ApiKeysSchema.$inferInsert;
export type ApiKeySelect = typeof ApiKeysSchema.$inferSelect;
