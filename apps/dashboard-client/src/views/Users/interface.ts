import {
  RoleSelectSchema, UserInsertSchema, UserSelectSchema
} from '@trg_package/schemas-dashboard/types';
import { UserInsertSchema as AuthUserInsertSchema } from '@trg_package/schemas-auth/types';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';

export const InsertFormSchema = UserInsertSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  role_id: true
}).extend({
  email: AuthUserInsertSchema.shape.email
});
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = UserSelectSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  role_id: true
}).extend({
  role: RoleSelectSchema.pick({ name: true }).nullable(),
});
export type SelectState = z.infer<typeof SelectFormSchema>;

export type FormState = SelectState | InsertState;

export type StateAsProps = {
  form: UseFormReturn<FormState>;
  type: 'Create' | 'Update'
};
