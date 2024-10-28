import { RoleSelectSchema, UserSelectSchema } from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';

export const formSchema = UserSelectSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  email: true,
  password: true
}).extend({
  role: RoleSelectSchema.optional()
});

export type State = z.infer<typeof formSchema>;

export const defaultValues: State = {
  id: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  role: undefined
};

export type StateAsProps = {
  form: UseFormReturn<State>;
};
