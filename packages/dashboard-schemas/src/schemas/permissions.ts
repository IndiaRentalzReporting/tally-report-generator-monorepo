import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { RoleSchema, RoleSelect } from './roles';
import { ModuleSchema, ModuleSelect } from './modules';
import { ActionSelect } from './actions';
import { BaseEntitySchema } from './base';

const { name, ...BaseEntitySchemaWithoutName } = BaseEntitySchema;

export const PermissionSchema = pgTable('permissions', {
  ...BaseEntitySchemaWithoutName,
  role_id: uuid('role_id')
    .notNull()
    .references(() => RoleSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
  module_id: uuid('module_id')
    .notNull()
    .references(() => ModuleSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
});

export type PermissionInsert = typeof PermissionSchema.$inferInsert;
export const PermissionInsertSchema = createInsertSchema(PermissionSchema);
export type PermissionSelect = typeof PermissionSchema.$inferSelect;
export const PermissionSelectSchema = createSelectSchema(PermissionSchema);
export interface DetailedPermission extends PermissionSelect {
  module: Pick<ModuleSelect, 'name' | 'id'>;
  role: Pick<RoleSelect, 'name' | 'id'>;
  permissionAction: Array<{ action: Pick<ActionSelect, 'name' | 'id'> }>;
}

export interface Permissions {
  module: Pick<ModuleSelect, 'icon' | 'name'>;
  actions: ActionSelect['name'][];
}

export interface DetailedPermission extends PermissionSelect {
  module: Pick<ModuleSelect, 'name' | 'id'>;
  role: Pick<RoleSelect, 'name' | 'id'>;
  permissionAction: Array<{
    action: Pick<ActionSelect, 'name' | 'id'>;
  }>;
}

export interface ModulePermissions {
  [module_id: string]: {
    [action_id: string]: boolean;
  };
}

export interface ModuleAction {
  module_id: ModuleSelect['id'];
  action_ids: ActionSelect['id'][];
}
