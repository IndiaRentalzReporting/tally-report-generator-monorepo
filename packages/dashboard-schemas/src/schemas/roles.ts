import { pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ModuleSelect } from './modules';
import { ActionSelect } from './actions';
import { BaseEntitySchema } from './base';
import { PermissionSelect } from './permissions';

export const RoleSchema = pgTable('roles', {
  ...BaseEntitySchema
});

export type RoleInsert = typeof RoleSchema.$inferInsert;
export const RoleInsertSchema = createInsertSchema(RoleSchema);
export type RoleSelect = typeof RoleSchema.$inferSelect;
export type DetailedRole = RoleSelect & {
  permission: Array<{
    permissionAction: Array<{
      action: {
        name: ActionSelect['name'];
        id: ActionSelect['id'];
      };
    }>;
    module: {
      name: ModuleSelect['name'];
      id: ModuleSelect['id'];
    };
  }>;
};

export interface RoleWithPermission extends RoleSelect {
  permission: Array<Pick<PermissionSelect, 'id'>>;
}

export const RoleSelectSchema = createSelectSchema(RoleSchema);
