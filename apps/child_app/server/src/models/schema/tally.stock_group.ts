import { pgTable, uuid, integer, varchar, timestamp } from "drizzle-orm/pg-core";

export const StockGroupSchema = pgTable("stock_group", {
    id: uuid("id").primaryKey().defaultRandom(),
    companyId: uuid("companyId"),
    masterId: integer("masterId"),
    stockGroupName: varchar('stockGroupName', { length: 200 }).notNull(),
    parent: varchar('parent', { length: 500 }),
    alterId: integer("alterId"),
    sortOrder: integer("sortOrder"),
    lastSyncDate: timestamp("lastSyncDate")
})