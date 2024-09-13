import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { UserSchema } from './users';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { BaseEntitySchema } from '@trg_package/schemas-base/schemas';
import { CompanySchema } from './companies';

const { id, name, ...BaseEntitySchemaWithoutIdAndName } = BaseEntitySchema;
export const UserCompanySchema = pgTable(
  'user_company',
  {
    ...BaseEntitySchemaWithoutIdAndName,
    company_id: uuid('company_id')
      .notNull()
      .references(() => CompanySchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      }),
    user_id: uuid('user_id')
      .notNull()
      .references(() => UserSchema.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.company_id, table.user_id]
    })
  })
);

export type UserCompanyInsert = typeof UserCompanySchema.$inferInsert;
export const UserCompanyInsertSchema = createInsertSchema(UserCompanySchema);
export type UserCompanySelect = typeof UserCompanySchema.$inferSelect;
export const UserCompanySelectSchema = createSelectSchema(UserCompanySchema);
