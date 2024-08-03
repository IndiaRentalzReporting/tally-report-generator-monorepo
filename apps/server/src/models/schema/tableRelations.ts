import { pgTable, uuid, timestamp, AnyPgColumn } from "drizzle-orm/pg-core";
import { TableSchema } from "./table";
import { ColumnSchema } from "./column";

export const TableRelationSchema = pgTable("table_relation", {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceTable: uuid("sourceTable").references(() => TableSchema.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }),
    referenceTable: uuid("referenceTable").references(() => TableSchema.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }),
    referenceColumn: uuid("referenceColumn").references(() => ColumnSchema.id, {
        onDelete: "cascade",
        onUpdate: "cascade"
    }),
    referenceRelation: uuid("referenceRelation").references((): AnyPgColumn => TableRelationSchema.id),
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow().$onUpdate(() => new Date())
});