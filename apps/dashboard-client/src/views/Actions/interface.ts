import { ActionInsertSchema, ActionSelectSchema } from '@trg_package/schemas-dashboard/types';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

export const InsertFormSchema = ActionInsertSchema.pick({ name: true, id: true });
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = ActionSelectSchema.pick({ name: true, id: true });
export type SelectState = z.infer<typeof SelectFormSchema>;

export type FormState = SelectState | InsertState;

export type StateAsProps = {
  form: UseFormReturn<FormState>;
};
