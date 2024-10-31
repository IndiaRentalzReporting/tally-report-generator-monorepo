import { pgTable, text } from 'drizzle-orm/pg-core';
import { BaseEntitySchema } from '@trg_package/schemas-base/schemas';
import { createInsertSchema } from 'drizzle-zod';

export const ApiKeySchema = pgTable('apiKeys', {
  ...BaseEntitySchema(),
  key: text('key').unique().notNull()
});

export type ApiKeyInsert = typeof ApiKeySchema.$inferInsert;
export const ApiKeyInsertSchema = createInsertSchema(ApiKeySchema);
export type ApiKeySelect = typeof ApiKeySchema.$inferSelect;
export const ApiKeySelectSchema = createInsertSchema(ApiKeySchema);
