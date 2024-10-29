import { pgTable, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const CompanyColumns = {
  name: varchar('name', { length: 200 }).notNull(),
  companyMailName: varchar('companyMailName', { length: 200 }),
  companyNumber: varchar('companyNumber', { length: 200 }),
  GSTNumber: varchar('GSTNumber',{ length: 512 })
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
