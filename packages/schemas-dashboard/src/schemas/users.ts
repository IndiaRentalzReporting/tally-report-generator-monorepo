import { varchar, uuid, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from '@trg_package/schemas-base/schemas';
import { RoleSchema } from './roles';

const { name, ...BaseEntitySchemaWithoutName } = BaseEntitySchema();

export const UserSchema = pgTable('users', {
  ...BaseEntitySchemaWithoutName,
  role_id: uuid('role_id').references(() => RoleSchema.id, {
    onDelete: 'set null',
    onUpdate: 'cascade'
  }),
  first_name: varchar('first_name', { length: 50 }).notNull(),
  last_name: varchar('last_name', { length: 50 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 128 }).notNull()
});

export type UserInsert = typeof UserSchema.$inferInsert;
export const UserInsertSchema = createInsertSchema(UserSchema);
export type UserSelect = typeof UserSchema.$inferSelect;
export const UserSelectSchema = createSelectSchema(UserSchema);
