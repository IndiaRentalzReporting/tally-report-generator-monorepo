import z from 'zod';
import { ColumnOperations } from '@trg_package/schemas-reporting/types';
import { DetailedColumnInsertSchema } from './column';

const ColumnOpertors = [...Object.keys(ColumnOperations).map((key) => key)] as const;

export const ReportColumnInsertSchema = z.object({
  column: DetailedColumnInsertSchema,
  heading: z.string(),
  operation: z.enum(ColumnOpertors as [string,...string[]]).or(z.undefined())
});
