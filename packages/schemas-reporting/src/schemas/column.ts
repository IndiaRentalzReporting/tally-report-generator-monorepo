import { varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable,pgEnum,AnyPgColumn } from "drizzle-orm/pg-core";
import { TableSchema } from "./table";
import { createInsertSchema } from "drizzle-zod";
import { text } from "drizzle-orm/pg-core";

export const ColumnType = pgEnum('column_type', [
    'id',
    'string',
    'number',
    'date',
    'foreignKey'
  ]);

export const ColumnSchema = pgTable("column",{
    id : uuid("id").primaryKey().defaultRandom(),
    name : varchar("name",{ length : 255 }).unique().notNull(),
    type : ColumnType("type").default("string").notNull(),
    tableId : uuid("tableId").references(()=>TableSchema.id,{onDelete : "restrict","onUpdate":"restrict"}).notNull(),
    referenceTable : text("referenceTable").references(()=>TableSchema.id).default("Null"),
    referenceColumn : text("referenceColumn").references(() : AnyPgColumn =>ColumnSchema.id).default("Null")
})

export type ColumnInsert = typeof ColumnSchema.$inferInsert;
export const ColumnInsertSchema = createInsertSchema(ColumnSchema);
