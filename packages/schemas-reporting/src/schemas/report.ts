import {
  varchar , text , uuid , pgTable,json
} from 'drizzle-orm/pg-core';

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TableSchema } from './table';
import {
  ReportColumnInsert, ReportConditionInsert,
  ReportConfigSelect, ReportFilterInsert, ReportGroupByInsert
} from '@/static-types';

export const ReportSchema = pgTable('report',{
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name',{ length: 500 }).unique().notNull(),
  description: text('description').default(''),
  baseEntity: uuid('baseEntity').references(() => TableSchema.id,{ onDelete: 'restrict',onUpdate: 'restrict' }).notNull(),
  tables: json('tables').$type<string[]>(),
  columns: json('columns').$type<ReportColumnInsert[] | []>(),
  filters: json('filters').$type<ReportFilterInsert[] | []>(),
  groupBy: json('groupBy').$type<ReportGroupByInsert[] | []>(),
  conditions: json('conditions').$type<ReportConditionInsert[] | []>(),
  queryConfig: json('queryConfig').$type<ReportConfigSelect>(),
});

export type ReportInsert = typeof ReportSchema.$inferInsert;
export const ReportInsertSchema = createInsertSchema(ReportSchema);
export type ReportSelect = typeof ReportSchema.$inferSelect;
export const ReportSelectSchema = createSelectSchema(ReportSchema);
