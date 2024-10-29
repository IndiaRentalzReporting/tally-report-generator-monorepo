import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const StockCatgoryColumns = {
  name: varchar('name', { length: 200 }).notNull(),
  aliasName: varchar('aliasName', { length: 200 }),
  parent: varchar('parent', { length: 500 })
};

export const StockCategorySchema = pgTable('tallyStockCategories', {
  ...TallyCommonSchema(),
  ...StockCatgoryColumns
});

export const StockCategoryTempSchema = pgTable('tempTallyStockCategories', {
  ...TallyCommonSchema(),
  ...StockCatgoryColumns
});

export type StockCategoryInsert = typeof StockCategorySchema.$inferInsert;
export const StockCategoryInsertSchema = createInsertSchema(StockCategorySchema);
export type StockCategorySelect = typeof StockCategorySchema.$inferSelect;
export const StockCategorySelectSchema = createSelectSchema(StockCategorySchema);
