import { ApiKeyInsertSchema, ApiKeySelectSchema } from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';

export const InsertFormSchema = ApiKeyInsertSchema.pick({ name: true });
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = ApiKeySelectSchema.pick({ name: true, id: true, key: true });
export type SelectState = z.infer<typeof SelectFormSchema>;
