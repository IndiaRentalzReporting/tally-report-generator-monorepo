import { ColumnTypeLiteral } from '../static-types/ColumnTypes';

export { type ColumnInsert, ColumnInsertSchema } from '../schemas/column';

export type ColumnSelect = {
    name : string,
    alias : string,
    displayName : string,
    table : string,
    tablealias : string,
    type : ColumnTypeLiteral,
}

// ColumnSelectSchema not required
