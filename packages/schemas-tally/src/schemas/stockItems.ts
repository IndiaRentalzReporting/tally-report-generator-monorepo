import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp,
  doublePrecision
} from 'drizzle-orm/pg-core';
import { TallyCommonSchema } from './base';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const StockItemColumns = {
  stockItemName: varchar('stockItemName', { length: 200 }).notNull(),
  aliasName: varchar('aliasName', { length: 200 }).notNull(),
  parent: varchar('parent', { length: 500 }).notNull(),
  category: varchar('category', { length: 500 }).notNull(),
  openingBalance: doublePrecision('openingBalance').notNull(),
  openingRate: doublePrecision('openingRate').notNull(),
  openingValue: doublePrecision('openingValue').notNull(),
  baseUnits: varchar('baseUnits', { length: 200 }).notNull()
};
export const StockItemSchema = pgTable('tallyStockItems', {
  ...TallyCommonSchema(),
  ...StockItemColumns
});

export const StockItemTempSchema = pgTable('tempTallyStockItems', {
  ...TallyCommonSchema(),
  ...StockItemColumns
});

export type StockItemInsert = typeof StockItemSchema.$inferInsert;
export const StockItemInsertSchema = createInsertSchema(StockItemSchema);
export type StockItemSelect = typeof StockItemSchema.$inferSelect;
export const StockItemSelectSchema = createSelectSchema(StockItemSchema);
