import { ColumnTypeLiteral } from "./ColumnTypes";

type Operation =  {
    operationType : string,
    operationParams? : string[]
}

const CommmonOperations = [
    {
        operationType: "COUNT"
    },
    {
        operationType: "MAX"
    },
    {
        operationType: "MIN"
    }
];
export const ColumnOperation : 
{ 
    [k in ColumnTypeLiteral]:Operation[] 
} = {
    "id":[
        {
            operationType : "COUNT"
        }
    ],
    "string": CommmonOperations,
    "number": [
        ...CommmonOperations,
        {
            operationType: "SUM"
        },
        {
            operationType: "AVG"
        }
    ],
    "date": [
        ...CommmonOperations,
        {
            operationType: "AGE",
            operationParams: ["date1", "date2"]
        }
    ],
    "foreignKey":[]
};