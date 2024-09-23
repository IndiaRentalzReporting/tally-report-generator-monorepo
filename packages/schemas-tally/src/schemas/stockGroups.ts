import {
  pgTable,
  uuid,
  integer,
  varchar,
  timestamp
} from 'drizzle-orm/pg-core';
import { TallyCommonSchema } from './base';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const StockGroupColumns = {
  stockGroupName: varchar('stockGroupName', { length: 200 }).notNull(),
  parent: varchar('parent', { length: 500 })
};
export const StockGroupSchema = pgTable('tallyStockGroups', {
  ...TallyCommonSchema(),
  ...StockGroupColumns
});

export const StockGroupTempSchema = pgTable('tempTallyStockGroups', {
  ...TallyCommonSchema(),
  ...StockGroupColumns
});

export type StockGroupInsert = typeof StockGroupSchema.$inferInsert;
export const StockGroupInsertSchema = createInsertSchema(StockGroupSchema);
export type StockGroupSelect = typeof StockGroupSchema.$inferSelect;
export const StockGroupSelectSchema = createSelectSchema(StockGroupSchema);
