import { Column } from "drizzle-orm"
import { ColumnSelect } from "./Column"


/**
 * GROUP BY {columnName}
 */
export type ReportGroupByInsert={
    column : ColumnSelect,
}

export type ReportGroupBySelect={
    column : ColumnSelect,
}
