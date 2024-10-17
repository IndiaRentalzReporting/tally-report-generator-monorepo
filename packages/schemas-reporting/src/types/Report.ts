import {
  type ColumnOperation as COS,
  type ColumnFormats as CF,
  type ColumnOperators as CO
} from '@/static-types';
import { type ReportInsert } from '../schemas/report';

export {
  type ReportInsert,
  ReportInsertSchema,
  type ReportSelect,
  ReportSelectSchema
} from '../schemas/report';

// Shape of report while fetching
export type ReportFetchSchema = Pick<
  ReportInsert,
  'id' | 'name' | 'queryConfig'
>;

export const ColumnOperators: CO = {
  id: [],
  string: [
    {
      operator: '=',
      params: ['Value']
    },
    {
      operator: 'IN',
      params: ['Value']
    },
    {
      operator: '!=',
      params: ['Value']
    },
    {
      operator: 'IS NULL',
      params: []
    },
    {
      operator: 'IS NOT NULL',
      params: []
    },
    {
      operator: 'LIKE',
      params: ['Value']
    },
    {
      operator: 'ILIKE',
      params: ['Value']
    }
  ],
  number: [
    {
      operator: '=',
      params: ['Value']
    },
    {
      operator: 'IN',
      params: ['Value']
    },
    {
      operator: '!=',
      params: ['Value']
    },
    {
      operator: 'IS NULL',
      params: []
    },
    {
      operator: 'IS NOT NULL',
      params: []
    },
    {
      operator: '<',
      params: ['Value']
    },
    {
      operator: '<=',
      params: ['Value']
    },
    {
      operator: '>',
      params: ['Value']
    },
    {
      operator: '>=',
      params: ['Value']
    },
    {
      operator: 'BETWEEN',
      params: ['From', 'To']
    }
  ],
  date: [
    {
      operator: '<',
      params: ['Value']
    },
    {
      operator: '<=',
      params: ['Value']
    },
    {
      operator: '>',
      params: ['Value']
    },
    {
      operator: '>=',
      params: ['Value']
    },
    {
      operator: 'BETWEEN',
      params: ['From', 'To']
    },
    {
      operator: '=',
      params: ['Value']
    },
    {
      operator: 'IN',
      params: ['Value']
    },
    {
      operator: '!=',
      params: ['Value']
    },
    {
      operator: 'IS NULL',
      params: []
    },
    {
      operator: 'IS NOT NULL',
      params: []
    }
  ],
  foreignKey: []
};

export const ColumnOperation: COS = {
  id: [
    {
      operationType: 'COUNT',
      operationParams: []
    }
  ],
  string: [
    {
      operationType: 'COUNT',
      operationParams: []
    },
    {
      operationType: 'MAX',
      operationParams: []
    },
    {
      operationType: 'MIN',
      operationParams: []
    }
  ],
  number: [
    {
      operationType: 'COUNT',
      operationParams: []
    },
    {
      operationType: 'MAX',
      operationParams: []
    },
    {
      operationType: 'MIN',
      operationParams: []
    },
    {
      operationType: 'SUM',
      operationParams: []
    },
    {
      operationType: 'AVG',
      operationParams: []
    }
  ],
  date: [
    {
      operationType: 'COUNT',
      operationParams: []
    },
    {
      operationType: 'MAX',
      operationParams: []
    },
    {
      operationType: 'MIN',
      operationParams: []
    },
    {
      operationType: 'AGE',
      operationParams: ['date1', 'date2']
    }
  ],
  foreignKey: []
};

export const ColumnFormats: CF = {
  id: [],
  string: [
    {
      operationType: 'STRING_AGG',
      operationParams: ['delimiter']
    },
    {
      operationType: 'LENGTH',
      operationParams: []
    },
    {
      operationType: 'REPLACE',
      operationParams: ['oldValue', 'newValue']
    },
    {
      operationType: 'UPPER',
      operationParams: []
    },
    {
      operationType: 'LOWER',
      operationParams: []
    },
    {
      operationType: 'SUBSTRING',
      operationParams: ['start', 'length']
    }
  ],
  number: [
    {
      operationType: 'ROUND',
      operationParams: ['value', 'precision']
    },
    {
      operationType: 'ABS',
      operationParams: []
    }
  ],
  date: [
    {
      operationType: 'DATE_TRUNC',
      operationParams: ['precision', 'date']
    },
    {
      operationType: 'EXTRACT',
      operationParams: ['field', 'source']
    },
    {
      operationType: 'TO_CHAR',
      operationParams: ['date', 'format']
    }
  ],
  foreignKey: []
};

export { type Operation, type OperatorType } from '../static-types';
