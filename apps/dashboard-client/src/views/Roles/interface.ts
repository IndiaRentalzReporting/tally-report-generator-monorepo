import { RoleSelectSchema } from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';

export const formSchema = RoleSelectSchema.pick({ id: true, name: true });

export type State = z.infer<typeof formSchema>;
export type StateAsProps = {
  form: UseFormReturn<State>
};
