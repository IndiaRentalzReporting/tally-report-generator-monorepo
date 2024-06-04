import { varchar, uuid, pgTable } from 'drizzle-orm/pg-core';

export const UserSchema = pgTable('user', {
  id: uuid('id').primaryKey(),
  name: varchar('name').notNull()
});
