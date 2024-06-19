import { timestamp, pgTable, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { RoleSchema } from './roles';
import { ModuleSchema } from './modules';

export const PermissionSchema = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  role_id: uuid('role_id')
    .notNull()
    .references(() => RoleSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
  module_id: uuid('module_id')
    .notNull()
    .references(() => ModuleSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade'
    }),
  createdAt: timestamp('createdAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { mode: 'date', precision: 3 })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
});

export type PermissionInsert = typeof PermissionSchema.$inferInsert;
export const PermissionInsertSchema = createInsertSchema(PermissionSchema);
export type PermissionSelect = typeof PermissionSchema.$inferSelect;
export const PermissionSelectSchema = createSelectSchema(PermissionSchema);
