import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { TableSchema } from "./table";
import { BaseEntitySchema } from "./baseEntitySchema";

export const ColumnSchema = pgTable("column", {
    ...BaseEntitySchema,
    tableId: uuid("tableId").references(() => TableSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
    })
})