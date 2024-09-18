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
export const StockGroupSchema = pgTable('tally_stock_group', {
  ...TallyCommonSchema,
  ...StockGroupColumns
});

export type StockGroupInsertSchema = typeof StockGroupSchema.$inferInsert;
export const StockGroupZodInsertSchema = createInsertSchema(
  StockGroupSchema
).omit({ id: true });
export type StockGroupSelectSchema = typeof StockGroupSchema.$inferSelect;
export const StockGroupZodSelectSchema = createSelectSchema(StockGroupSchema);

export const StockGroupTempSchema = pgTable('temp_tally_stock_group', {
  ...TallyCommonSchema,
  ...StockGroupColumns
});
