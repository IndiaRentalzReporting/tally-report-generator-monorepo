import {
  integer,
  varchar,
  pgTable
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const GroupColumns = {
  groupName: varchar('groupName', { length: 200 }),
  aliasName: varchar('aliasName', { length: 200 }),
  parentId: integer('parentId'),
  primaryGroup: varchar('primaryGroup', { length: 200 }),
  natureofGroup: varchar('natureofGroup', { length: 200 }) //
};
export const GroupSchema = pgTable('tallyGroups', {
  ...TallyCommonSchema(),
  ...GroupColumns
});

export const GroupTempSchema = pgTable('tempTallyGroups', {
  ...TallyCommonSchema(),
  ...GroupColumns
});

export type GroupInsert = typeof GroupSchema.$inferInsert;
export const GroupInsertSchema = createInsertSchema(GroupSchema);
export type GroupSelect = typeof GroupSchema.$inferSelect;
export const GroupSelectSchema = createSelectSchema(GroupSchema);
