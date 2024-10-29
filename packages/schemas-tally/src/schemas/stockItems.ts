import {
  pgTable,
  varchar,
  doublePrecision,
  integer , text
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const StockItemColumns = {
  name: varchar('name', { length: 500 }).notNull(),
  parent: varchar('parent', { length: 500 }),
  aliasName: varchar('aliasName', { length: 200 }),
  groupMasterId: integer('groupMasterId'),
  category: varchar('category', { length: 500 }),
  categoryMasterId: integer('categoryMasterId'),
  openingBalance: doublePrecision('openingBalance'),
  openingRate: doublePrecision('openingRate'),
  openingValue: doublePrecision('openingValue'),
  baseUnit: varchar('baseUnits', { length: 200 }),
  baseUnitMasterId: integer('baseUnitMasterId'),
  attributeStr01: text('attributeStr01'),
  attributeStr02: text('attributeStr02'),
  attributeStr03: text('attributeStr03'),
  attributeStr04: text('attributeStr04'),
  attributeStr05: text('attributeStr05'),
  attributeStr06: text('attributeStr06'),
  attributeStr07: text('attributeStr07'),
  attributeStr08: text('attributeStr08'),
  attributeStr09: text('attributeStr09'),
  attributeStr10: text('attributeStr10'),
  attributeNum01: integer('attributeNum01'),
  attributeNum02: integer('attributeNum02'),
  attributeNum03: integer('attributeNum03'),
  attributeNum04: integer('attributeNum04'),
  attributeNum05: integer('attributeNum05'),
  attributeNum06: integer('attributeNum06'),
  attributeNum07: integer('attributeNum07'),
  attributeNum08: integer('attributeNum08'),
  attributeNum09: integer('attributeNum09'),
  attributeNum10: integer('attributeNum10'),

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
