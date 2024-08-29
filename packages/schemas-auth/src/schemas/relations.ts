import { relations } from 'drizzle-orm';
import { UserSchema } from './user';
import { TenantSchema } from './tenant';

export const userRelation = relations(UserSchema, ({ one }) => ({
  tenant: one(TenantSchema, {
    fields: [UserSchema.tenant_id],
    references: [TenantSchema.id]
  })
}));

export const tenantRelation = relations(TenantSchema, ({ many }) => ({
  user: many(UserSchema)
}));
