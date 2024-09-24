import { pgTable, varchar, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const CompanyColumns = {
  companyName: varchar('companyName', { length: 200 }).notNull(),
  companyMailName: varchar('companyMailName', { length: 200 }).notNull(),
  companyNumber: varchar('companyNumber', { length: 200 }).notNull(),
  ledgerAlterID: integer('ledgerAlterID').notNull(),
  stockItemAlterID: integer('stockItemAlterID').notNull(),
  voucherMasterID: integer('voucherMasterID').notNull()
};

export const CompanySchema = pgTable('tallyCompanies', {
  ...(() => {
    const { companyId, ...rest } = TallyCommonSchema();
    return rest;
  })(),
  ...CompanyColumns
});

export const CompanyTempSchema = pgTable('tempTallyCompanies', {
  ...(() => {
    const { companyId, ...rest } = TallyCommonSchema();
    return rest;
  })(),
  ...CompanyColumns
});

export type CompanyInsert = typeof CompanySchema.$inferInsert;
export const CompanyInsertSchema = createInsertSchema(CompanySchema);
export type CompanySelect = typeof CompanySchema.$inferSelect;
export const CompanySelectSchema = createSelectSchema(CompanySchema);
