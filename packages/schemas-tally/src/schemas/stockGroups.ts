import {
  pgTable,
  varchar
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const StockGroupColumns = {
  name: varchar('name', { length: 200 }).notNull(),
  aliasName: varchar('aliasName', { length: 200 }),
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
