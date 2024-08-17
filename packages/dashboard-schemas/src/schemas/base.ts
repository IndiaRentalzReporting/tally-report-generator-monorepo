import { pgEnum, boolean, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const EntityStatus = pgEnum('status', [
  'deleted',
  'approved',
  'active',
  'inactive'
]);

export const EntityTimestamps = {
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deletedAt'),
  approvedAt: timestamp('approvedAt')
};

export const BaseEntitySchema = {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: varchar('name', { length: 200 }).notNull(),
  status: EntityStatus('status').default('active').notNull(),
  isReadonly: boolean('isReadonly').notNull().default(false),
  ...EntityTimestamps
};
