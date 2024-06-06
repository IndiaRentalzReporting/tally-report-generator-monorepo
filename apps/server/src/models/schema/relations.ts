import { timestamp, primaryKey, pgTable, uuid } from 'drizzle-orm/pg-core';
import { UserSchema } from './users';
import { RoleSchema } from './roles';
import { PermissionSchema } from './permissions';

export const UserRoleSchema = pgTable(
  'user_role',
  {
    user_id: uuid('user_id')
      .references(() => UserSchema.id)
      .notNull(),
    role_id: uuid('role_id')
      .references(() => RoleSchema.id)
      .notNull(),
    assignedAt: timestamp('assignedAt', { mode: 'date', precision: 3 })
      .defaultNow()
      .notNull()
  },
  (user_role_table) => ({
    primaryKey: primaryKey({
      columns: [user_role_table.user_id, user_role_table.role_id]
    })
  })
);

export type UserRoleInsert = typeof UserRoleSchema.$inferInsert;
export type UserRoleSelect = typeof UserRoleSchema.$inferSelect;

export const PermissionRoleSchema = pgTable(
  'permission_role',
  {
    permission_id: uuid('permission_id')
      .references(() => PermissionSchema.id)
      .notNull(),
    role_id: uuid('role_id')
      .references(() => RoleSchema.id)
      .notNull(),
    assignedAt: timestamp('assignedAt', { mode: 'date', precision: 3 })
      .defaultNow()
      .notNull()
  },
  (permission_role_table) => ({
    primaryKey: primaryKey({
      columns: [
        permission_role_table.permission_id,
        permission_role_table.role_id
      ]
    })
  })
);

export type PermissionRoleInsert = typeof PermissionRoleSchema.$inferInsert;
export type PermissionRoleSelect = typeof PermissionRoleSchema.$inferSelect;
