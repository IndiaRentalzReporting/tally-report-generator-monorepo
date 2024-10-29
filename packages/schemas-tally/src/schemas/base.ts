import {
  integer , varchar , uuid
} from 'drizzle-orm/pg-core';

export const TallyCommonSchema = () => ({
  id: uuid('id').primaryKey().defaultRandom(),
  guid: varchar('guid', { length: 200 }).notNull(),
  companyId: varchar('companyId'),
  masterId: integer('masterId').notNull().unique(),
  alterId: integer('alterId').notNull()
});
