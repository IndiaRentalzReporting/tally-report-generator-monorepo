export { type ConditionOperator,type ConditionParams } from '../static-types/conditionOperators';

export const ConditionOperators = {
  id: [],
  string: [
    {
      operator: '=',
      params: ['value']
    },{
      operator: 'IN',
      params: ['value']
    },{
      operator: '!=',
      params: ['value']
    },{
      operator: 'IS NULL',
      params: null
    },{
      operator: 'IS NOT NULL',
      params: null
    },{
      operator: 'LIKE',
      params: ['value']
    },{
      operator: 'ILIKE',
      params: ['value']
    }
  ],
  number: [
    {
      operator: '=',
      params: ['value']
    },
    {
      operator: 'IN',
      params: ['value']
    },
    {
      operator: '!=',
      params: ['value']
    },
    {
      operator: 'IS NULL',
      params: null
    },
    {
      operator: 'IS NOT NULL',
      params: null
    },
    {
      operator: '<',
      params: ['value']
    },
    {
      operator: '<=',
      params: ['value']
    },
    {
      operator: '>',
      params: ['value']
    },
    {
      operator: '>=',
      params: ['value']
    },
    {
      operator: 'BETWEEN',
      params: ['from','to']
    }
  ],
  date: [
    {
      operator: '<',
      params: ['value']
    },
    {
      operator: '<=',
      params: ['value']
    },
    {
      operator: '>',
      params: ['value']
    },
    {
      operator: '>=',
      params: ['value']
    },
    {
      operator: 'BETWEEN',
      params: ['from','to']
    },
    {
      operator: '=',
      params: ['value']
    },
    {
      operator: 'IN',
      params: ['value']
    },
    {
      operator: '!=',
      params: ['value']
    },
    {
      operator: 'IS NULL',
      params: null
    },
    {
      operator: 'IS NOT NULL',
      params: null
    }
  ]
};
