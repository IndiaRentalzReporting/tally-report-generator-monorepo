import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { TallyCommonSchema } from './base';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const StockCatgoryColumns = {
  stockCategoryName: varchar('stockCategoryName', { length: 200 }).notNull(),
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
export const StockCategoryInsertSchema =
  createInsertSchema(StockCategorySchema);
export type StockCategorySelect = typeof StockCategorySchema.$inferSelect;
export const StockCategorySelectSchema =
  createSelectSchema(StockCategorySchema);
