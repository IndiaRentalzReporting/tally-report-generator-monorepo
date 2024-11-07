import { Dispatch, SetStateAction } from 'react';
import {
  ActionSelectSchema,
  ModulePermissions,
  ModuleSelectSchema,
  PermissionInsertSchema,
  PermissionSelectSchema,
  RoleSelectSchema
} from '@trg_package/schemas-dashboard/types';
import * as z from 'zod';
import { UseFormReturn } from 'react-hook-form';

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
});

export const PermissionActionSchema = z.array(z.object({
  action: ActionSchema
}));

export const InsertFormSchema = PermissionInsertSchema.pick({
  id: true,
}).extend({
  module: ModuleSchema,
  role: RoleSchema,
  permissionAction: PermissionActionSchema
});
export type InsertState = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = PermissionSelectSchema.pick({
  id: true,
}).extend({
  module: ModuleSchema,
  role: RoleSchema,
  permissionAction: PermissionActionSchema
});
export type SelectState = z.infer<typeof SelectFormSchema>;

export type FormState = InsertState | SelectState;

export const initialState: InsertState = {
  id: '',
  module: {
    name: '',
    id: ''
  },
  permissionAction: [],
  role: {
    name: '',
    id: ''
  }
};

export interface StateAsProps {
  modulePermissions: ModulePermissions;
  setModulePermissions: Dispatch<SetStateAction<ModulePermissions>>;
  form: UseFormReturn<FormState>
}
