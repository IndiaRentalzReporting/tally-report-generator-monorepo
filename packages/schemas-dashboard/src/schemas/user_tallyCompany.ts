import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { CompanySchema } from '@trg_package/schemas-tally/schemas';
import { UserSchema } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from '@trg_package/schemas-base/schemas';

const { id, name, ...BaseEntitySchemaWithoutIdAndName } = BaseEntitySchema;
export const UserTallyCompanySchema = pgTable(
  'user_tallyCompany',
  {
    ...BaseEntitySchemaWithoutIdAndName,
    user_id: uuid('user_id')
      .notNull()
      .references(() => UserSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    tallyCompany_id: uuid('tallyCompany_id')
      .notNull()
      .references(() => CompanySchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.user_id, table.tallyCompany_id]
    })
  })
);

export type UserTallyCompanyInsert = typeof UserTallyCompanySchema.$inferInsert;
export const UserTallyCompanyInsertSchema = createInsertSchema(
  UserTallyCompanySchema
);
export type UserTallyCompanySelect = typeof UserTallyCompanySchema.$inferSelect;
export const UserTallyCompanySelectSchema = createSelectSchema(
  UserTallyCompanySchema
);
