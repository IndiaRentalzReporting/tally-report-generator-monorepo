import {
  pgTable,
  varchar,
  date,
  text
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const VoucherColumns = {
  voucherTypeName: varchar('voucherTypeName',{ length: 255 }),
  date: date('date'),
  voucherNumber: varchar('voucherNumber',{ length: 512 }),
  narration: text('narration')
};
export const VoucherSchema = pgTable('tallyVouchers', {
  ...TallyCommonSchema(),
  ...VoucherColumns
});

export const VoucherTempSchema = pgTable('tempTallyVouchers', {
  ...TallyCommonSchema(),
  ...VoucherColumns
});

export type VoucherInsert = typeof VoucherSchema.$inferInsert;
export const VoucherInsertSchema = createInsertSchema(VoucherSchema);
export type VoucherSelect = typeof VoucherSchema.$inferSelect;
export const VoucherSelectSchema = createSelectSchema(VoucherSchema);
