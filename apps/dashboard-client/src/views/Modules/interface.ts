import { ModuleInsertSchema, ModuleSelectSchema } from '@trg_package/schemas-dashboard/types';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

export const InsertFormSchema = ModuleInsertSchema.pick({
  name: true, id: true, icon: true, isPrivate: true
});
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = ModuleSelectSchema.pick({
  name: true, id: true, icon: true, isPrivate: true
});
export type SelectState = z.infer<typeof SelectFormSchema>;

export type FormState = SelectState | InsertState;

export type StateAsProps = {
  form: UseFormReturn<FormState>;
};
