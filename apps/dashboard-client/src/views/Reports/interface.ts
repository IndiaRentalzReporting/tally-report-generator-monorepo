import { ReportSelectSchema } from '@trg_package/schemas-reporting/types';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';

export const formSchema = ReportSelectSchema.pick({
  id: true,
  name: true,
  baseEntity: true,
  description: true
});

export type State = z.infer<typeof formSchema>;

export type StateAsProps = {
  form: UseFormReturn<State>;
};

export const defaultValues: State = {
  id: '',
  name: '',
  baseEntity: '',
  description: ''
};
