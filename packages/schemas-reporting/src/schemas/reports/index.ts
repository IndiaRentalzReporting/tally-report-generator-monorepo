import {
  varchar , text , uuid , pgTable,json
} from 'drizzle-orm/pg-core';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TableSchema } from '../tables';
import { ReportColumnInsert } from './columns';
import { ReportFilterInsert } from './filters';
import { ReportGroupByInsert } from './groupBy';
import { ReportConditionInsert } from './conditions';
import { ReportQueryConfigSelect } from './queryConfig';

export const ReportSchema = pgTable('reports',{
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name',{ length: 500 }).unique().notNull(),
  description: text('description').default(''),
  baseEntity: uuid('baseEntity').references(() => TableSchema.id,{ onDelete: 'restrict',onUpdate: 'restrict' }).notNull(),
  tables: json('tables').$type<string[]>().default([]).notNull(),
  columns: json('columns').$type<ReportColumnInsert[]>().default([]).notNull(),
  filters: json('filters').$type<ReportFilterInsert[]>().default([]).notNull(),
  groupBy: json('groupBy').$type<ReportGroupByInsert[]>().default([]).notNull(),
  conditions: json('conditions').$type<ReportConditionInsert[]>().default([]).notNull(),
  queryConfig: json('queryConfig').$type<ReportQueryConfigSelect>(),
});

export type ReportInsert = typeof ReportSchema.$inferInsert;
export const ReportInsertSchema = createInsertSchema(ReportSchema);
export type ReportSelect = typeof ReportSchema.$inferSelect;
export const ReportSelectSchema = createSelectSchema(ReportSchema);
