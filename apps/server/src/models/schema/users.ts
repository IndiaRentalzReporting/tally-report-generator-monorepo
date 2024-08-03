import { varchar, uuid, pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { RoleSchema, RoleSelect } from './roles';
import { PermissionSelect } from './permissions';
import { ModuleSelect } from './modules';
import { ActionSelect } from './actions';
import { BaseEntitySchema } from './base';

declare global {
  namespace Express {
    interface User extends DetailedUser {}
  }
}

export const IsConfirmed = pgEnum('is_confirmed', [
  'onboarded',
  'authenticated',
  'unauthenticated'
]);

const { name, ...BaseEntitySchemaWithoutName } = BaseEntitySchema;

export const UserSchema = pgTable('users', {
  ...BaseEntitySchemaWithoutName,
  role_id: uuid('role_id').references(() => RoleSchema.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 128 }).notNull(),
  is_confirmed: IsConfirmed('is_confirmed').default('onboarded').notNull()
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
