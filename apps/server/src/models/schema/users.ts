import { timestamp, varchar, uuid, pgTable } from 'drizzle-orm/pg-core';
import { RoleSchema, RoleSelect } from './roles';

declare global {
  namespace Express {
    interface User extends UserSelect {}
  }
}
export const UserSchema = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  role_id: uuid('role_id').references(() => RoleSchema.id),
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
export type UserSelect = typeof UserSchema.$inferSelect;
export type UserWithRole = UserSelect & {
  role: Pick<RoleSelect, 'name'> | null;
};
