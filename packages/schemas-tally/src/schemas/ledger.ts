import {
  uuid,
  varchar,
  timestamp,
  pgTable,
  doublePrecision,
  integer
} from 'drizzle-orm/pg-core';
import { TallyCommonSchema } from './base';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const LedgerColumns = {
  ledgerName: varchar('ledgerName', { length: 200 }),
  aliasName: varchar('aliasName', { length: 200 }),
  parent: varchar('parent', { length: 200 }),
  primaryGroup: varchar('primaryGroup', { length: 200 }),
  mailingName: varchar('mailingName', { length: 200 }),
  addressLine1: varchar('addressLine1', { length: 200 }),
  addressLine2: varchar('addressLine2', { length: 200 }),
  addressLine3: varchar('addressLine3', { length: 200 }),
  addressLine4: varchar('addressLine4', { length: 200 }),
  countryName: varchar('countryName', { length: 100 }),
  stateName: varchar('stateName', { length: 100 }),
  PINCode: varchar('PINCode', { length: 10 }),
  GSTIN: varchar('GSTIN', { length: 20 }),
  PANNo: varchar('PANNo', { length: 20 }),
  contactPerson: varchar('contactPerson', { length: 100 }),
  mobile: varchar('mobile', { length: 20 }),
  phone: varchar('phone', { length: 20 }),
  fax: varchar('fax', { length: 20 }),
  email: varchar('email', { length: 100 }),
  emailCC: varchar('emailCC', { length: 100 }),
  website: varchar('website', { length: 100 }),
  openingBalance: doublePrecision('openingBalance')
};

export const LedgerSchema = pgTable('tally_ledger', {
  ...TallyCommonSchema,
  ...LedgerColumns
});

export const LedgerTempSchema = pgTable('temp_tally_ledger', {
  ...TallyCommonSchema,
  ...LedgerColumns
});

export type LedgerInsert = typeof LedgerSchema.$inferInsert;
export const LedgerInsertSchema = createInsertSchema(LedgerSchema);
export type LedgerSelect = typeof LedgerSchema.$inferSelect;
export const LedgerSelectSchema = createSelectSchema(LedgerSchema);
