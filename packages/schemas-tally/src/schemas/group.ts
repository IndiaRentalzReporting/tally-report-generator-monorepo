import {
  uuid,
  integer,
  varchar,
  timestamp,
  pgTable
} from 'drizzle-orm/pg-core';
import { TallyCommonSchema } from './base';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const GroupColumns = {
  groupName: varchar('groupName', { length: 200 }),
  aliasName: varchar('aliasName', { length: 200 }),
  parentId: integer('parentId'),
  primaryGroup: varchar('primaryGroup', { length: 200 }),
  natureofGroup: varchar('natureofGroup', { length: 200 }) //
};
export const GroupSchema = pgTable('tally_group', {
  ...TallyCommonSchema,
  ...GroupColumns
});

export const GroupTempSchema = pgTable('temp_tally_group', {
  ...TallyCommonSchema,
  ...GroupColumns
});

export type GroupInsertSchema = typeof GroupSchema.$inferInsert;
export const GroupZodInsertSchema = createInsertSchema(GroupSchema);
export type GroupSelectSchema = typeof GroupSchema.$inferSelect;
export const GroupZodSelectSchema = createSelectSchema(GroupSchema);
