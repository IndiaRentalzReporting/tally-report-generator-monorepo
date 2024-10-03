import { ColumnTypeLiteral } from "./ColumnTypes";

export type OperatorType ={operator : string,params? : string[]};
const commonOperators : OperatorType[]= [ {
    operator : "=",
    params : ['value']        
},
{
    operator : "IN",
    params : ['value']
},
{
    operator : "!=",
    params : ['value']        
},
{
    operator : "IS NULL",
},
{
    operator : "IS NOT NULL",
},
];

const commonNumericOperators = [ {
    operator : "<",
    params: ['value']
},
{
    operator : "<=",
    params: ['value']
},
{
    operator : ">",
    params: ['value']
},
{
    operator : ">=",
    params: ['value']
},
{
    operator : "BETWEEN",
    params: ['from','to']
}];
export const Operators: { [k in ColumnTypeLiteral]:OperatorType[] } = {
    "id" : [],
    "string": [
       ...commonOperators,
       {
        operator : "LIKE",
        params : ['value']        
        },
        {
            operator : "ILIKE",
            params : ['value']        
        },
    ],
    "number": [
        ...commonOperators,
        ...commonNumericOperators        
    ],
    "date": [
       ...commonNumericOperators,
       ...commonOperators
    ],
    "foreignKey" : []
};
