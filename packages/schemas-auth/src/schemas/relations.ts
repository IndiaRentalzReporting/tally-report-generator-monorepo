import { relations } from 'drizzle-orm';
import { UserSchema } from './users';
import { TenantSchema } from './tenants';

export const userRelation = relations(UserSchema, ({ one }) => ({
  tenant: one(TenantSchema, {
    fields: [UserSchema.tenant_id],
    references: [TenantSchema.id]
  })
}));

export const tenantRelation = relations(TenantSchema, ({ many }) => ({
  user: many(UserSchema)
}));
