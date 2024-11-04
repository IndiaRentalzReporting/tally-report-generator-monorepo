import { ReportInsertSchema, ReportSelectSchema } from '@trg_package/schemas-reporting/types';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

export const InsertFormSchema = ReportInsertSchema.pick({
  name: true, id: true, baseEntity: true, description: true
});
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = ReportSelectSchema.pick({
  name: true, id: true, baseEntity: true, description: true
});
export type SelectState = z.infer<typeof SelectFormSchema>;

export type FormState = SelectState | InsertState;

export type StateAsProps = {
  form: UseFormReturn<FormState>,
  disabledFields?: {
    [key in keyof FormState]? : boolean;
  }
};
