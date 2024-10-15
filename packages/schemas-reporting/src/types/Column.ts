import { ColumnTypeLiteral } from '@/static-types/column';

export { type ColumnInsert, ColumnInsertSchema } from '../schemas/column';

export type ColumnSelect = {
  name: string;
  alias: string;
  displayName: string;
  table: string;
  tablealias: string;
  type: ColumnTypeLiteral;
};

// ColumnSelectSchema not required
export { type ColumnTypeLiteral } from '../static-types/column';
