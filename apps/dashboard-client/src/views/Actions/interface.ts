import { ActionSelectSchema } from '@trg_package/schemas-dashboard/types';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';

export const formSchema = ActionSelectSchema.pick({ name: true, id: true });
export type State = z.infer<typeof formSchema>;
export type StateAsProps = { form: UseFormReturn<State> };
