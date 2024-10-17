import { Operators, OperatorType } from "./reportOperator"
import { ReportColumnInsert } from "./reportColumn"
import { ColumnSelect } from "../types/Column"
import { type ConditionOperators } from "./conditionOperators"

// WHERE  {JOIN} {table}.{column}  {operator} {value}
// WHERE table.name like "%abc"
// WHERE table.name between (from,to)
export type ConditionInsert = {
    column : ColumnSelect,
    operator : ConditionOperators<ConditionInsert['column']['type']>[number]['operator']
    params : ConditionOperators<ConditionInsert['column']['type']>[number]['params'],
    join : "AND" | "OR" | "AND NOT" | "OR NOT"
}

export type ConditionSelect = {
    column : ColumnSelect,
    operator :ConditionOperators<ConditionInsert['column']['type']>[number]['operator'],
    params : ConditionOperators<ConditionInsert['column']['type']>[number]['params'],
    join : "AND" | "OR" | "AND NOT" | "OR NOT"
}
