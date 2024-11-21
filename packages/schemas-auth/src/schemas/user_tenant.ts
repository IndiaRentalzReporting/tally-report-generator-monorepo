import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TenantSchema } from './tenants';
import { UserSchema } from './users';

export const UserTenantSchema = pgTable(
  'user_tenant',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => UserSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    tenant_id: uuid('tenant_id')
      .notNull()
      .references(() => TenantSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.tenant_id, table.user_id]
    })
  })
);

export type UserTenantInsert = typeof UserTenantSchema.$inferInsert;
export const UserTenantInsertSchema = createInsertSchema(
  UserTenantSchema
);
export type UserTenantSelect = typeof UserTenantSchema.$inferSelect;
export const UserTenantSelectSchema = createSelectSchema(
  UserTenantSchema
);
