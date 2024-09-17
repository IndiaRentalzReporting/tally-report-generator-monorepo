import { relations } from 'drizzle-orm';
import { UserSchema } from './users';
import { RoleSchema } from './roles';
import { PermissionSchema } from './permissions';
import { ModuleSchema } from './modules';
import { ActionSchema } from './actions';
import { PermissionActionSchema } from './permission_action';

export const userSchemaRelation = relations(UserSchema, ({ one, many }) => ({
  role: one(RoleSchema, {
    fields: [UserSchema.role_id],
    references: [RoleSchema.id]
  })
}));

export const roleSchemaRelation = relations(RoleSchema, ({ one, many }) => ({
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

export const moduleSchemaRelation = relations(
  ModuleSchema,
  ({ one, many }) => ({
    permission: many(PermissionSchema)
  })
);

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
