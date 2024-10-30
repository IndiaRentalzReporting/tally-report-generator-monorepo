import z from 'zod';
import { DetailedColumnInsertSchema } from './column';

export const ReportGroupByInsertSchema = z.object({
  column: DetailedColumnInsertSchema
});
