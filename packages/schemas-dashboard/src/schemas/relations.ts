import { relations } from 'drizzle-orm';
import { UserSchema } from './users';
import { RoleSchema } from './roles';
import { PermissionSchema } from './permissions';
import { ModuleSchema } from './modules';
import { ActionSchema } from './actions';
import { PermissionActionSchema } from './permission_action';
import { CompanySchema } from '@trg_package/schemas-tally/schemas';
import { UserTallyCompanySchema } from './user_tallyCompany';

export const userSchemaRelation = relations(UserSchema, ({ one, many }) => ({
  role: one(RoleSchema, {
    fields: [UserSchema.role_id],
    references: [RoleSchema.id]
  }),
  company: many(CompanySchema)
}));

export const CompanySchemaRelation = relations(CompanySchema, ({ many }) => ({
  user: many(UserSchema)
}));

export const UserTallyCompanySchemaRelation = relations(
  UserTallyCompanySchema,
  ({ one }) => ({
    company: one(CompanySchema, {
      fields: [UserTallyCompanySchema.tallyCompany_id],
      references: [CompanySchema.id]
    }),
    user: one(UserSchema, {
      fields: [UserTallyCompanySchema.user_id],
      references: [UserSchema.id]
    })
  })
);

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
