import {
  varchar , text , uuid , pgTable,json
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ReportColumnInsert } from '@/types/reportColumn';
import { ConditionInsert } from '@/types/reportCondition';
import { ReportFilterInsert } from '@/types/reportFilter';
import { ReportGroupByInsert } from '@/types/reportGroupBy';
import { ReportConfigSelect } from '@/types/reportQueryConfig';
import { TableSchema } from './table';

export const ReportSchema = pgTable('report',{
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name',{ length: 500 }).unique().notNull(),
  description: text('description').default(''),
  baseEntity: uuid('baseEntity').references(() => TableSchema.id,{ onDelete: 'restrict',onUpdate: 'restrict' }).notNull(),
  tables: json('tables').$type<string[]>(),
  columns: json('columns').$type<ReportColumnInsert[]>(),
  filters: json('filters').$type<ReportFilterInsert[]>(),
  groupBy: json('groupBy').$type<ReportGroupByInsert[]>(),
  conditons: json('conditions').$type<ConditionInsert[]>(),
  queryConfig: json('queryConfig').$type<ReportConfigSelect>(),
});

export type ReportInsert = typeof ReportSchema.$inferInsert;
export const ReportInsertSchema = createInsertSchema(ReportSchema);
export type ReportSelect = typeof ReportSchema.$inferSelect;
export const ReportSelectSchema = createSelectSchema(ReportSchema);
