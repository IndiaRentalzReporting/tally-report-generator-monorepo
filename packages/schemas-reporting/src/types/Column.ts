import { ColumnType } from '@/schemas';

export type ColumnTypeLiteral = (typeof ColumnType.enumValues)[number];

export {
  type ColumnInsert, ColumnInsertSchema, type ColumnSelect, ColumnSelectSchema
} from '../schemas/column';

export type DetailedColumnSelect = {
  name: string;
  alias: string;
  displayName: string;
  table: string;
  tablealias: string;
  type: ColumnTypeLiteral;
};
