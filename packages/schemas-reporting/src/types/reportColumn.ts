import { ColumnTypeLiteral } from "./ColumnTypes"
import { ColumnFormats } from "./reportFormat"
import { ColumnOperation } from "./reportOperation"


//Select table.name as alias 
//Select Operation(table.name) as alias
//Select FORMAT(table.name) as alias
export type ReportColumnInsert = {
    name : string,
    type : ColumnTypeLiteral
    table : string,
    alias : string,
    heading : string,
    operation : typeof ColumnOperation[ReportColumnInsert['type']] | null
    format : typeof ColumnFormats[ReportColumnInsert['type']] | null
}


export type ReportColumnSelect = {
    alias : string, //Use this as response key
    heading : string // Use this as table column heading
}