import { varchar, timestamp, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { ModuleSelect } from './modules';
import { ActionSelect } from './actions';

export const RoleSchema = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type RoleInsert = typeof RoleSchema.$inferInsert;
export const RoleInsertSchema = createInsertSchema(RoleSchema);
export type RoleSelect = typeof RoleSchema.$inferSelect;
export type DetailedRole = RoleSelect & {
  permission: Array<{
    permissionAction: Array<{
      action: {
        name: ActionSelect['name'];
        id: ActionSelect['id'];
      };
    }>;
    module: {
      name: ModuleSelect['name'];
      id: ModuleSelect['id'];
    };
  }>;
};
export const RoleSelectSchema = createSelectSchema(RoleSchema);
