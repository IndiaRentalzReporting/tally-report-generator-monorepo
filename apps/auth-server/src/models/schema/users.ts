import { varchar, uuid, pgTable, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';

declare global {
  namespace Express {
    interface User extends UserSelect {}
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
export type SafeUserSelect = Omit<UserSelect, 'password'>;
