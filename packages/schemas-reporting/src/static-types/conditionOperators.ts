import { ColumnTypeLiteral } from '../types';

export type ConditionOperators<T extends ColumnTypeLiteral> = 
    T extends 'string'?[
        {
            operator: '=',
            params: {value : string}
        },
        {
            operator: 'IN',
            params: {value : string[]}
        },
        {
            operator: '!=',
            params: {value : string}
        },
        {
            operator: 'IS NULL',
            params : null
        },
        {
            operator: 'IS NOT NULL',
            params : null
        },
        {
            operator: 'LIKE',
            params: {value : string}
        },
        {
            operator: 'ILIKE',
            params: {value : string}
        }
    ]: T extends Number?[
        {
            operator: '=',
            params: {value : string}
        },
        {
            operator: 'IN',
            params: {value : string[]}
        },
        {
            operator: '!=',
            params: {value : string}
        },
        {
            operator: 'IS NULL',
            params : null
        },
        {
            operator: 'IS NOT NULL',
            params : null
        },
        {
            operator: '<',
            params: {value : number}
        },
        {
            operator: '<=',
            params: {value : number}
        },
        {
            operator: '>',
            params: {value : number}
        },
        {
            operator: '>=',
            params: {value : number}
        },
        {
            operator: 'BETWEEN',
            params: {from : number, to : number}
        }   
    ]: T extends 'date'?[
        {
            operator: '<',
            params: {value: Date}
          },
          {
            operator: '<=',
            params: {value: Date}
          },
          {
            operator: '>',
            params: {value: Date}
          },
          {
            operator: '>=',
            params: {value: Date}
          },
          {
            operator: 'BETWEEN',
            params: {from : Date, to : Date}
          },
          {
            operator: '=',
            params: {value: Date}
          },
          {
            operator: 'IN',
            params: {value : Date[]}
          },
          {
            operator: '!=',
            params: {value: Date}
          },
          {
            operator: 'IS NULL',
            params: null
          },
          {
            operator: 'IS NOT NULL',
            params: null
          }
    ]:[];