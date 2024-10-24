import { ColumnType } from '@/schemas';

export type ColumnTypeLiteral = Exclude<(typeof ColumnType.enumValues)[number],'foreignKey' | 'id'>;

export {
  type ColumnInsert, ColumnInsertSchema, type ColumnSelect, ColumnSelectSchema
} from '../schemas/column';

export type DetailedColumnSelect = {
  id : string;
  name: string;
  alias: string;
  displayName: string;
  table: string;
  heading : string;
  tablealias: string;
  type: ColumnTypeLiteral;
};
