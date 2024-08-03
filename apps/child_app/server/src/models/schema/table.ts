import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const TableSchema = pgTable("table", {
    id: uuid("id").primaryKey().defaultRandom(),
    tableName: varchar("name", { length: 200 }),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date())
});