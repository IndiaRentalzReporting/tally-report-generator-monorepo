import { ModuleSelectSchema } from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';

export const formSchema = ModuleSelectSchema.pick({
  id: true,
  name: true,
  isPrivate: true,
  icon: true
});
export type State = z.infer<typeof formSchema>;
export type StateAsProps = {
  form: UseFormReturn<State>;
};
