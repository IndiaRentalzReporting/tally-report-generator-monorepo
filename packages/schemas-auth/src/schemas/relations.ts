import { relations } from 'drizzle-orm';
import { UserSchema } from './users';
import { TenantSchema } from './tenants';
import { UserTenantSchema } from './user_tenant';

export const userRelation = relations(UserSchema, ({ many }) => ({
  userTenants: many(UserTenantSchema)
}));

export const tenantRelation = relations(TenantSchema, ({ many }) => ({
  userTenants: many(UserTenantSchema)
}));

export const userTenantSchemaRelation = relations(
  UserTenantSchema,
  ({ one }) => ({
    user: one(UserSchema, {
      fields: [UserTenantSchema.user_id],
      references: [UserSchema.id]
    }),
    tenant: one(TenantSchema, {
      fields: [UserTenantSchema.tenant_id],
      references: [TenantSchema.id]
    })
  })
);
