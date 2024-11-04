import z from 'zod';
import {
  type ReportInsert,
  type ReportSelect,
  ReportSelectSchema,
  ReportInsertSchema as InsertSchema,
} from '@/schemas/reports';
import { ReportColumnInsertSchema, ColumnOperations } from '@/schemas/reports/columns';
import { ReportConditionInsertSchema, ConditionOperations } from '@/schemas/reports/conditions';
import { ReportFilterInsertSchema, FilterOperations } from '@/schemas/reports/filters';
import { ReportGroupByInsertSchema } from '@/schemas/reports/groupBy';
import {
  GeneratedReportColumns,
  GeneratedReportData,
  GeneratedReportFilters,
  RuntimeFilters
} from '@/schemas/reports/generator';

const ReportInsertSchema = InsertSchema.extend({
  columns: z.array(ReportColumnInsertSchema),
  conditions: z.array(ReportConditionInsertSchema),
  filters: z.array(ReportFilterInsertSchema),
  groupBy: z.array(ReportGroupByInsertSchema)
});

export {
  ColumnOperations,
  ConditionOperations,
  FilterOperations,
  type GeneratedReportColumns,
  type GeneratedReportData,
  type GeneratedReportFilters,
  type RuntimeFilters,

  type ReportInsert,
  type ReportSelect,
  ReportInsertSchema,
  ReportSelectSchema
};
