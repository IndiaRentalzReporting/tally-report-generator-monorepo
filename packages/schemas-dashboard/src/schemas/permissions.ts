import { pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from '@trg_package/schemas-base/schemas';
import { RoleSchema } from './roles';
import { ModuleSchema } from './modules';

const { name, ...BaseEntitySchemaWithoutName } = BaseEntitySchema();

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
