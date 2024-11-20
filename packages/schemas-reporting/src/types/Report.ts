import z from 'zod';
import {
  type ReportInsert,
  type ReportSelect,
  ReportSelectSchema,
  ReportInsertSchema as InsertSchema,
} from '@/schemas/reports';
import {
  ReportColumnInsertSchema,
  ColumnOperations,
  ReportColumnConfig,
  GeneratedReportColumns
} from '@/schemas/reports/columns';
import { ReportConditionInsertSchema, ConditionOperations } from '@/schemas/reports/conditions';
import {
  ReportFilterInsertSchema,
  FilterOperations,
  GeneratedReportFilters,
  RuntimeFilters,
  FilterValueSchema
} from '@/schemas/reports/filters';
import { ReportGroupByInsertSchema } from '@/schemas/reports/groupBy';

const ReportInsertSchema = InsertSchema.extend({
  columns: z.array(ReportColumnInsertSchema),
  conditions: z.array(ReportConditionInsertSchema),
  filters: z.array(ReportFilterInsertSchema),
  groupBy: z.array(ReportGroupByInsertSchema)
});

type GeneratedReportData = { [T in ReportColumnConfig['alias'] ] : string };

export {
  ColumnOperations,
  ConditionOperations,
  FilterOperations,
  type GeneratedReportColumns,
  type GeneratedReportData,
  type GeneratedReportFilters,
  type RuntimeFilters,
  FilterValueSchema,

  type ReportInsert,
  type ReportSelect,
  ReportInsertSchema,
  ReportSelectSchema
};
