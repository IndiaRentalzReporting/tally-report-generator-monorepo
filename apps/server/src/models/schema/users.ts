import {
  timestamp,
  varchar,
  uuid,
  pgTable,
  pgEnum,
  boolean
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { RoleSchema, RoleSelect } from './roles';
import { PermissionSelect } from './permissions';
import { ModuleSelect } from './modules';
import { ActionSelect } from './actions';

declare global {
  namespace Express {
    interface User extends DetailedUser {}
  }
}

export const UserSchema = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  role_id: uuid('role_id').references(() => RoleSchema.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
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

export type UserInsert = typeof UserSchema.$inferInsert;
export const UserInsertSchema = createInsertSchema(UserSchema);
export type UserSelect = typeof UserSchema.$inferSelect;
export const UserSelectSchema = createSelectSchema(UserSchema);
export type DetailedUser = UserSelect & {
  role: {
    name: RoleSelect['name'];
    permission: Array<{
      id: PermissionSelect['id'];
      permissionAction: Array<{
        action: {
          name: ActionSelect['name'];
        };
      }>;
      module: {
        id: ModuleSelect['id'];
        name: ModuleSelect['name'];
      };
    }>;
  } | null;
};
