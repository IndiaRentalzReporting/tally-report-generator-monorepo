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
import { SelectState as RoleState } from '../Roles/interface';

export const InsertFormSchema = PermissionInsertSchema.pick({
  id: true,
}).extend({
  module: ModuleSelectSchema.pick({
    id: true,
    name: true
  }),
  role: RoleSelectSchema.pick({
    id: true,
    name: true
  }),
  permissionAction: z.array(z.object({
    action: ActionSelectSchema.pick({
      name: true,
      id: true
    })
  }))
});
export type InsertForm = z.infer<typeof InsertFormSchema>;

export const SelectFormSchema = PermissionSelectSchema.pick({
  id: true,
}).extend({
  module: ModuleSelectSchema.pick({
    id: true,
    name: true
  }),
  role: RoleSelectSchema.pick({
    id: true,
    name: true
  }),
  permissionAction: z.array(z.object({
    action: ActionSelectSchema.pick({
      name: true,
      id: true
    })
  }))
});
export type SelectForm = z.infer<typeof SelectFormSchema>;

export type FormState = InsertForm | SelectForm;

export const initialState: InsertForm = {
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
  role?: RoleState['name'];
  modulePermissions: ModulePermissions;
  setModulePermissions: Dispatch<SetStateAction<ModulePermissions>>;
  form: UseFormReturn<FormState>
}
