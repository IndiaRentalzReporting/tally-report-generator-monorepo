import * as z from 'zod';
import {
  type ColumnInsert,
  ColumnInsertSchema,
  type ColumnSelect,
  ColumnSelectSchema,
  ColumnType
} from '@/schemas/columns';

const DetailedColumnInsertSchema = z.object({
  id: z.string(),
  name: z.string(),
  alias: z.string(),
  displayName: z.string(),
  table: z.string(),
  heading: z.string(),
  tablealias: z.string(),
  type: z.enum(ColumnType.enumValues)
});

type DetailedColumnSelect = {
  id : string;
  name: string;
  alias: string;
  displayName: string;
  table: string;
  heading : string;
  tablealias: string;
  type: ColumnTypeLiteral;
};

type ColumnTypeLiteral = Exclude<(typeof ColumnType.enumValues)[number],'foreignKey' | 'id'>;

export {
  type DetailedColumnSelect,
  type ColumnTypeLiteral,
  ColumnType,
  DetailedColumnInsertSchema,

  type ColumnInsert,
  type ColumnSelect,
  ColumnInsertSchema,
  ColumnSelectSchema,
};
