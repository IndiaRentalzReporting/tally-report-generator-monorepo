import { timestamp, primaryKey, pgTable, uuid } from 'drizzle-orm/pg-core';
import { UserSchema, RoleSchema, PermissionSchema } from '../schema';

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

export * from './users';
export * from './permissions';
export * from './roles';
