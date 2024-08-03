import { uuid, integer, varchar, timestamp, pgTable } from 'drizzle-orm/pg-core';

export const groups = pgTable('groups', {
    id: uuid('id').defaultRandom().notNull().primaryKey(),
    companyID: varchar('companyName', { length: 200 }),
    groupName: varchar('groupName', { length: 200 }),
    aliasName: varchar('aliasName', { length: 200 }),
    parentId: integer('parentId'),
    primaryGroup: varchar('primaryGroup', { length: 200 }),
    natureofGroup: varchar('natureofGroup', { length: 200 }),
    alterID: integer('alterID'),
    masterID: integer('masterID'),
    sortOrder: integer('sortOrder'),
    lastSyncDate: timestamp('lastSyncDate')
});