import {
  pgTable, varchar , integer , date , doublePrecision
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { TallyCommonSchema } from './base';

const InventoryVoucherColumns = {
  voucherTypeName: varchar('voucherTypeName',{ length: 255 }),
  date: date('date'),
  voucherNumber: varchar('voucherNumber',{ length: 512 }),
  stockItemName: varchar('stockItemName' , { length: 512 }),
  stockItemMasterId: integer('stockItemMasterId'),
  billedQty: integer('billedQty'),
  actualQty: integer('actualQty'),
  inwardQty: integer('inwardQty'),
  outwardQty: integer('outwardQty'),
  discount: integer('discount'),
  amount: doublePrecision('amount'),
  rate: doublePrecision('rate')
  //   narration: text('narration')
};

export const InventoryVoucherSchema = pgTable('tallyInventoryVouchers', {
  ...TallyCommonSchema(),
  ...InventoryVoucherColumns
});

export const InventoryVoucherTempSchema = pgTable('tempTallyInventoryVouchers', {
  ...TallyCommonSchema(),
  ...InventoryVoucherColumns
});

export type InventoryVoucherInsert = typeof InventoryVoucherSchema.$inferInsert;
export const InventoryVoucherInsertSchema = createInsertSchema(InventoryVoucherSchema);
export type InventoryVoucherSelect = typeof InventoryVoucherSchema.$inferSelect;
export const InventoryVoucherSelectSchema = createSelectSchema(InventoryVoucherSchema);
