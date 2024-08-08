import { primaryKey, pgTable, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { UserSchema } from './users';
import { RoleSchema } from './roles';
import { PermissionSchema } from './permissions';
import { ModuleSchema } from './modules';
import { ActionSchema } from './actions';

export const PermissionActionSchema = pgTable(
  'permission_action',
  {
    permission_id: uuid('permission_id')
      .notNull()
      .references(() => PermissionSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    action_id: uuid('action_id')
      .notNull()
      .references(() => ActionSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.permission_id, table.action_id]
    })
  })
);

export const userSchemaRelation = relations(UserSchema, ({ one }) => ({
  role: one(RoleSchema, {
    fields: [UserSchema.role_id],
    references: [RoleSchema.id]
  })
}));

export const roleSchemaRelation = relations(RoleSchema, ({ many }) => ({
  user: many(UserSchema),
  permission: many(PermissionSchema)
}));

export const permissionSchemaRelation = relations(
  PermissionSchema,
  ({ one, many }) => ({
    role: one(RoleSchema, {
      fields: [PermissionSchema.role_id],
      references: [RoleSchema.id]
    }),
    module: one(ModuleSchema, {
      fields: [PermissionSchema.module_id],
      references: [ModuleSchema.id]
    }),
    permissionAction: many(PermissionActionSchema)
  })
);

export const moduleSchemaRelation = relations(ModuleSchema, ({ many }) => ({
  permission: many(PermissionSchema)
}));

export const permissionActionSchemaRelation = relations(
  PermissionActionSchema,
  ({ one }) => ({
    permission: one(PermissionSchema, {
      fields: [PermissionActionSchema.permission_id],
      references: [PermissionSchema.id]
    }),
    action: one(ActionSchema, {
      fields: [PermissionActionSchema.action_id],
      references: [ActionSchema.id]
    })
  })
);

export const actionSchemaRelation = relations(ActionSchema, ({ many }) => ({
  permissionAction: many(PermissionActionSchema)
}));

export type PermissionActionInsert = typeof PermissionActionSchema.$inferInsert;
export type PermissionActionSelect = typeof PermissionActionSchema.$inferSelect;
