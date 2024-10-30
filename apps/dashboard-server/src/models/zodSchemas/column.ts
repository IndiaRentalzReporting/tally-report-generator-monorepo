import z from 'zod';

import { ColumnType } from '../schemas';

export const DetailedColumnInsertSchema = z.object({
  id: z.string(),
  name: z.string(),
  alias: z.string(),
  displayName: z.string(),
  table: z.string(),
  heading: z.string(),
  tablealias: z.string(),
  type: z.enum(ColumnType.enumValues)
});
