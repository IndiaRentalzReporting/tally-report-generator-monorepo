import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const StockCatgoriesSchema = pgTable("stock_categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    comapnuId: uuid("companyId"),
    masterId: integer("masterId"),
    alterId: integer("alterId"),
    stockCategoryName: varchar('stockCategoryName', { length: 200 }).notNull(),
    parent: varchar('parent', { length: 500 }),
    sortOrder: integer("sortOrder"),
    lastSyncDate: timestamp("lastSyncDate")
});