import {
  pgTable,
  varchar
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const UnitColumns = {
  name: varchar('name', { length: 200 }),
};
export const UnitSchema = pgTable('tallyUnits', {
  ...TallyCommonSchema(),
  ...UnitColumns
});

export const UnitTempSchema = pgTable('tempTallyUnits', {
  ...TallyCommonSchema(),
  ...UnitColumns
});

export type UnitInsert = typeof UnitSchema.$inferInsert;
export const UnitInsertSchema = createInsertSchema(UnitSchema);
export type UnitSelect = typeof UnitSchema.$inferSelect;
export const UnitSelectSchema = createSelectSchema(UnitSchema);
