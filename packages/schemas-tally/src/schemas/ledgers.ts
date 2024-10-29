import {
  pgTable,
  varchar,
  date , integer
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const LedgerColumns = {
  name: varchar('name',{ length: 255 }).notNull(),
  parent: varchar('parent',{ length: 255 }).notNull(),
  aliasName: varchar('aliasName',{ length: 255 }),
  primaryGroup: varchar('varchar',{ length: 255 }),
  addressLine1: varchar('addressLine1',{ length: 255 }),
  addressLine2: varchar('addressLine2',{ length: 255 }),
  addressLine3: varchar('addressLine3',{ length: 255 }),
  addressLine4: varchar('addressLine4',{ length: 255 }),
  pincode: varchar('pincode',{ length: 512 }),
  state: varchar('state',{ length: 255 }),
  country: varchar('country',{ length: 255 }),
  GSTNumber: varchar('GSTNumber',{ length: 512 }),
  PANNo: varchar('PANNo',{ length: 512 }),
  mailingName: varchar('mailingName',{ length: 255 }),
  contactPerson: varchar('contactPerson',{ length: 512 }),
  mobile: varchar('mobile',{ length: 512 }),
  phone: varchar('phone',{ length: 512 }),
  fax: varchar('fax',{ length: 512 }),
  email: varchar('email',{ length: 512 }),
  emailCC: varchar('emailCC',{ length: 512 }),
  website: varchar('website',{ length: 512 }),
  openingBalance: integer('openingBalance'),
  region: varchar('region',{ length: 512 }),
  salesPerson: varchar('salesPerson',{ length: 512 }),
  channel: varchar('channel',{ length: 512 }),
  segment: varchar('segment',{ length: 512 }),
  creationDate: date('creationDate'),
};

export const LedgerSchema = pgTable('tallyLedgers', {
  ...TallyCommonSchema(),
  ...LedgerColumns
});

export const LedgerTempSchema = pgTable('tempTallyLedgers', {
  ...TallyCommonSchema(),
  ...LedgerColumns
});

export type LedgerInsert = typeof LedgerSchema.$inferInsert;
export const LedgerInsertSchema = createInsertSchema(LedgerSchema);
export type LedgerSelect = typeof LedgerSchema.$inferSelect;
export const LedgerSelectSchema = createSelectSchema(LedgerSchema);
