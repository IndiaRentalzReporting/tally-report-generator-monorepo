import { ColumnTypeLiteral } from "./ColumnTypes";

export const ColumnFormats: { [k in ColumnTypeLiteral]: {operationType : string,operationParams? : string[]}[] } = {
    "id" : [],
    "string": [
        {
            operationType: "STRING_AGG",
            operationParams: ["delimiter"]
        },
        {
            operationType: "LENGTH"
        },
        {
            operationType: "REPLACE",
            operationParams: ["oldValue", "newValue"]
        },
        {
            operationType: "UPPER"
        },
        {
            operationType: "LOWER"
        },
        {
            operationType: "SUBSTRING",
            operationParams: ["start", "length"]
        }
    ],
    "number": [
        {
            operationType: "ROUND",
            operationParams: ["value", "precision"]
        },
        {
            operationType: "ABS"
        }
    ],
    "date": [
        {
            operationType: "DATE_TRUNC",
            operationParams: ["precision", "date"]
        },
        {
            operationType: "EXTRACT",
            operationParams: ["field", "source"]
        },
        {
            operationType: "TO_CHAR",
            operationParams: ["date", "format"]
        }
    ],
    "foreignKey":[

    ]
};
