import { ColumnSelect } from "../types/Column"

/**
 * Used by user to filter reports when report is running or viewed
 * These data filters will be picked by user after report is generated
 */
export type ReportFilterInsert = {
    column:ColumnSelect
    filterType : "search" | "select" | "range",
}


export type ReportFilterSelect = {
    column : ColumnSelect
    filterType : "search" | "select" | "range",
}

