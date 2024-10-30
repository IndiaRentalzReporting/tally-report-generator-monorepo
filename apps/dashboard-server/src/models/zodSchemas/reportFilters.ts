import z from 'zod';
import { DetailedColumnInsertSchema } from './column';

export const ReportFilterInsertSchema = z.object({
  column: DetailedColumnInsertSchema,
  filterType: z.enum(['default','search','select'])
});
