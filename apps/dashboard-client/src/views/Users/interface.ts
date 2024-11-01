import {
  RoleSelectSchema, UserInsertSchema, UserSelectSchema
} from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';

export const InsertFormSchema = UserInsertSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  password: true
}).extend({
  role: RoleSelectSchema.pick({ name: true, id: true }).nullable()
});
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = UserSelectSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  password: true
}).extend({
  role: RoleSelectSchema.pick({ name: true }).nullable()
});
export type SelectState = z.infer<typeof SelectFormSchema>;

export type FormState = SelectState | InsertState;

export type StateAsProps = {
  form: UseFormReturn<FormState>;
};
