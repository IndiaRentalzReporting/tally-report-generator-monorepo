import { ColumnTypeLiteral } from './ColumnTypes';

export { type ColumnInsert, ColumnInsertSchema } from '../schemas/column';

export type ColumnSelect = {
  name: string;
  table: string;
  tablealias: string;
  type: ColumnTypeLiteral;
};

// ColumnSelectSchema not required
