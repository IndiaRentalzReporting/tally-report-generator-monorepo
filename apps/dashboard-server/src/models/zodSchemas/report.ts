import { ReportInsertSchema as InsertSchema } from '@trg_package/schemas-reporting/types';
import z from 'zod';
import { ReportColumnInsertSchema } from './reportColumn';
import { ReportConditionInsertSchema } from './reportCondition';
import { ReportFilterInsertSchema } from './reportFilters';
import { ReportGroupByInsertSchema } from './reportGroupBy';

export const ReportInsertSchema = InsertSchema.extend({
  columns: z.array(ReportColumnInsertSchema),
  conditions: z.array(ReportConditionInsertSchema),
  filters: z.array(ReportFilterInsertSchema),
  groupBy: z.array(ReportGroupByInsertSchema)
});
