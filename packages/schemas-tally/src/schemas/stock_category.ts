import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { TallyCommonSchema, TempTableCommonSchema } from "./base";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";



const StockCatgoryColumns = {
    stockCategoryName: varchar('stockCategoryName', { length: 200 }).notNull(),
    parent: varchar('parent', { length: 500 })
}

export const StockCategorySchema = pgTable("tally_stock_category", {
    ...TallyCommonSchema(),
    ...StockCatgoryColumns
});


export type StockCategoryInsertSchema = typeof StockCategorySchema.$inferInsert;
export const StockCategoryZodInsertSchema = createInsertSchema(StockCategorySchema).omit({id : true});
export type StockCategorySelectSchema = typeof StockCategorySchema.$inferSelect;
export const StockCategoryZodSelectSchema = createSelectSchema(StockCategorySchema);

export const StockCategoryTempSchema = pgTable("temp_tally_stock_category", {
    ...TallyCommonSchema(),
    ...StockCatgoryColumns
});