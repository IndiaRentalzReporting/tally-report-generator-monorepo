import {
  ActionSelectSchema,
  ModuleSelectSchema,
  PermissionInsertSchema,
  PermissionSelectSchema,
  RoleSelectSchema
} from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

export const ModuleSchema = ModuleSelectSchema.pick({
  id: true,
  name: true
});

export const RoleSchema = RoleSelectSchema.pick({
  id: true,
  name: true
});

export const ActionSchema = ActionSelectSchema.pick({
  name: true,
  id: true
}).extend({
  checked: z.boolean(),
});

export const PermissionActionSchema = z.array(z.object({
  action: ActionSchema
}));

export const InsertFormSchema = PermissionInsertSchema.pick({
}).extend({
  module: ModuleSchema,
  role: RoleSchema.optional(),
  permissionAction: PermissionActionSchema
});
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = PermissionSelectSchema.pick({
}).extend({
  module: ModuleSchema,
  role: RoleSchema,
  permissionAction: PermissionActionSchema
});
export type SelectState = z.infer<typeof SelectFormSchema>;

export type FormState = {
  permissions: Array<InsertState | SelectState>
};

export interface StateAsProps {
  form: UseFormReturn<FormState>
  fields: FieldArrayWithId<FormState, 'permissions', 'id'>[]
}
