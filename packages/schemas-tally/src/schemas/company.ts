import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { TallyCommonSchema } from './base';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const { companyId, ...SchemaWithoutCompany } = TallyCommonSchema;

const CompanyColumns = {
  companyName: varchar('companyName', { length: 200 }).notNull(),
  companyMailName: varchar('companyMailName', { length: 200 }).notNull(),
  companyNumber: varchar('companyNumber', { length: 200 }).notNull(),
  ledgerAlterID: integer('ledgerAlterID').notNull(),
  stockItemAlterID: integer('stockItemAlterID').notNull(),
  voucherMasterID: integer('voucherMasterID').notNull()
};

export const CompanySchema = pgTable('tally_company', {
  ...SchemaWithoutCompany,
  ...CompanyColumns
});

export const CompanyTempSchema = pgTable('temp_tally_company', {
  ...SchemaWithoutCompany,
  ...CompanyColumns
});

export type CompanyInsertSchema = typeof CompanySchema.$inferInsert;
export const CompanyZodInsertSchema = createInsertSchema(CompanySchema);
export type CompanySelectSchema = typeof CompanySchema.$inferSelect;
export const CompanyZodSelectSchema = createSelectSchema(CompanySchema);
