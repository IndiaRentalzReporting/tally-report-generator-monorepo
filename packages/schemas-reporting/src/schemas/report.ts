import { varchar } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable,json } from "drizzle-orm/pg-core";
import { TableSchema } from "./table";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { ReportColumnInsert } from "@/types/reportColumn";
import { ConditionInsert } from "@/types/reportCondition";
import { ReportFilterInsert } from "@/types/reportFilter";
import { ReportGroupByInsert } from "@/types/reportGroupBy";
import { ReportConfigSelect } from "@/types/reportQueryConfig";

export const ReportSchema = pgTable("report",{
    id : uuid("id").primaryKey().defaultRandom(),
    name : varchar("name",{length : 500}).unique().notNull(),
    description : text("description").default(""),
    baseEntity : uuid("baseEntity").references(()=>TableSchema.id,{onDelete : "restrict","onUpdate":"restrict"}),
    tables : json('tables').notNull().$type<String[]>(),
    columns : json('columns').notNull().$type<ReportColumnInsert[]>(),
    filters : json('filters').notNull().$type<ReportFilterInsert>(),
    groupBy : json('groupBy').$type<ReportGroupByInsert>(),
    conditons : json('conditions').$type<ConditionInsert>(),
    queryConfig : json('queryConfig').$type<ReportConfigSelect>(),
})


export type ReportInsert = typeof ReportSchema.$inferInsert;
export const ReportInsertSchema = createInsertSchema(ReportSchema);
export const ReportSelectSchema = createSelectSchema(ReportSchema);
export type ReportSelect = typeof ReportSchema.$inferSelect;