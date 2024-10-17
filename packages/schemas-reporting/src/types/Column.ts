import { ColumnType } from '@/schemas';

export type ColumnTypeLiteral = (typeof ColumnType.enumValues)[number];

export { type ColumnInsert, ColumnInsertSchema } from '../schemas/column';

export type ColumnSelect = {
  name: string;
  alias: string;
  displayName: string;
  table: string;
  tablealias: string;
  type: ColumnTypeLiteral;
};

