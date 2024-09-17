import {
    CompanySchema,
    CompanyZodInsertSchema,
    CompanyZodSelectSchema 
} from "../schemas/company";


export type InsertSchema = typeof CompanySchema['$inferInsert'];
export type SelectSchema = typeof CompanySchema['$inferSelect'];
export const ZodInsertSchema = CompanyZodInsertSchema;
export const ZodSelectSchema = CompanyZodSelectSchema;