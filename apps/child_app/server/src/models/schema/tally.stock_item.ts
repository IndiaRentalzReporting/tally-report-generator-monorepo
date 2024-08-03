import { pgTable, uuid, integer, varchar, timestamp, doublePrecision } from "drizzle-orm/pg-core";

export const StockItemSchema = pgTable("stock_item", {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("companyId"),
    stockItemName: varchar('stockGroupName', { length: 200 }).notNull(),
    aliasName: varchar('stockGroupName', { length: 200 }).notNull(),
    parent: varchar('parent', { length: 500 }),
    category: varchar('parent', { length: 500 }),
    openingBalance: doublePrecision("openingBalance"),
    openingRate: doublePrecision("openingRate"),
    openingValue: doublePrecision("openingValue"),
    baseUnits: varchar("baseUnits", { length: 200 }),
    masterId: integer("masterId"),
    alterId: integer("alterId"),
    sortOrder: integer("sortOrder"),
    lastSyncDate: timestamp("lastSyncDate")
})