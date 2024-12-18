import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from './base';
import { ActionSchema } from './actions';
import { PermissionSchema } from './permissions';

const { id, name, ...BaseEntitySchemaWithoutIdAndName } = BaseEntitySchema();

export const PermissionActionSchema = pgTable(
  'permission_action',
  {
    ...BaseEntitySchemaWithoutIdAndName,
    permission_id: uuid('permission_id')
      .notNull()
      .references(() => PermissionSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    action_id: uuid('action_id')
      .notNull()
      .references(() => ActionSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.permission_id, table.action_id]
    })
  })
);

export type PermissionActionInsert = typeof PermissionActionSchema.$inferInsert;
export const PermissionActionInsertSchema = createInsertSchema(
  PermissionActionSchema
);
export type PermissionActionSelect = typeof PermissionActionSchema.$inferSelect;
export const PermissionActionSelectSchema = createSelectSchema(
  PermissionActionSchema
);
