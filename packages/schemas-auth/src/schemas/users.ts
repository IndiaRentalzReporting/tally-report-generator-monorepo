import { varchar, uuid, pgTable } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const UserSchema = pgTable('users', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 128 }).notNull(),
});

export type UserInsert = typeof UserSchema.$inferInsert;
export const UserInsertSchema = createInsertSchema(UserSchema).extend({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});
export type UserSelect = typeof UserSchema.$inferSelect;
export const UserSelectSchema = createSelectSchema(UserSchema).extend({
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});
