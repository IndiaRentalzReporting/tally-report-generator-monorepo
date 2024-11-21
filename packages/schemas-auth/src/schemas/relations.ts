import { relations } from 'drizzle-orm';
import { UserSchema } from './users';
import { TenantSchema } from './tenants';
import { UserTenantSchema } from './user_tenant';

export const userRelation = relations(UserSchema, ({ many }) => ({
  tenant: many(TenantSchema)
}));

export const tenantRelation = relations(TenantSchema, ({ many }) => ({
  user: many(UserSchema)
}));

export const UserTenantSchemaRelation = relations(
  UserTenantSchema,
  ({ one }) => ({
    permission: one(UserSchema, {
      fields: [UserTenantSchema.user_id],
      references: [UserSchema.id]
    }),
    action: one(TenantSchema, {
      fields: [UserTenantSchema.tenant_id],
      references: [TenantSchema.id]
    })
  })
);
