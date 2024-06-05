import {
  primaryKey,
  boolean,
  timestamp,
  varchar,
  uuid,
  pgTable
} from 'drizzle-orm/pg-core';

declare global {
  namespace Express {
    interface User extends UserSelect {}
  }
}

export const UserSchema = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 128 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type UserInsert = typeof UserSchema.$inferInsert; // type for inserting new users
export type UserSelect = typeof UserSchema.$inferSelect;

export const RoleSchema = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export const PermissionSchema = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  can_create: boolean('can_create').default(false).notNull(),
  can_read: boolean('can_read').default(false).notNull(),
  can_update: boolean('can_update').default(false).notNull(),
  can_delete: boolean('can_delete').default(false).notNull(),
  can_import: boolean('can_import').default(false).notNull(),
  can_export: boolean('can_export').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

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
