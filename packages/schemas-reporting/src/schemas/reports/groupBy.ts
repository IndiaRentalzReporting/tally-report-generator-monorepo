import z from 'zod';
import { DetailedColumnSelect } from '../../types';
import { DetailedColumnInsertSchema } from '../../types/column';

export const ReportGroupByInsertSchema = z.object({
  column: DetailedColumnInsertSchema
});

export type ReportGroupByInsert = {
  column: DetailedColumnSelect;
};

export type ReportGroupBySelect = {
  column: DetailedColumnSelect;
};