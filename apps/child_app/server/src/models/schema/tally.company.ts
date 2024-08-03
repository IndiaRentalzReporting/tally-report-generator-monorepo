import { integer, varchar, pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';

export const CompanySchema = pgTable('company', {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    companyName: varchar('companyName', { length: 200 }),
    companyMailName: varchar('companyMailName', { length: 200 }),
    guid: varchar('guid', { length: 200 }),
    companyNumber: varchar('companyNumber', { length: 200 }),
    ledgerAlterID: integer('ledgerAlterID'),
    stockItemAlterID: integer('stockItemAlterID'),
    voucherMasterID: integer('voucherMasterID'),
    lastSyncDate: timestamp('lastSyncDate')
});
