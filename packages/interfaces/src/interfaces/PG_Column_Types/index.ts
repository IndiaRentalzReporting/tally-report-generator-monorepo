export const PGColumnDataType = {
  SMALLINT: {
    value: () => 'SMALLINT' as const,
    example: '1',
    ts_type: 'number'
  },
  INTEGER: {
    value: () => 'INTEGER' as const,
    example: '12345',
    ts_type: 'number'
  },
  BIGINT: {
    value: () => 'BIGINT' as const,
    example: '123456789012345',
    ts_type: 'number'
  },
  DECIMAL: {
    value: () => 'DECIMAL' as const,
    example: '12345.67',
    ts_type: 'number'
  },
  NUMERIC: {
    value: (p?: number, s?: number) =>
      `NUMERIC${p && s ? `(${p}, ${s})` : ''}` as const,
    example: '12345.67',
    ts_type: 'number'
  },
  REAL: {
    value: () => 'REAL' as const,
    example: '12345.67',
    ts_type: 'number'
  },
  DOUBLE_PRECISION: {
    value: () => 'DOUBLE PRECISION' as const,
    example: '12345.6789',
    ts_type: 'number'
  },
  SERIAL: { value: () => 'SERIAL' as const, example: '1', ts_type: 'number' },
  BIGSERIAL: {
    value: () => 'BIGSERIAL' as const,
    example: '1',
    ts_type: 'number'
  },
  MONEY: {
    value: () => 'MONEY' as const,
    example: '$12345.67',
    ts_type: 'string'
  },
  CHAR: {
    value: (n?: number) => `CHAR${n ? `(${n})` : ''}` as const,
    example: 'A',
    ts_type: 'string'
  },
  VARCHAR: {
    value: (n?: number) => `VARCHAR${n ? `(${n})` : ''}` as const,
    example: 'Example text',
    ts_type: 'string'
  },
  TEXT: {
    value: () => 'TEXT' as const,
    example: 'This is a text field with a lot of text',
    ts_type: 'string'
  },
  BYTEA: {
    value: () => 'BYTEA' as const,
    example: '\\xDEADBEEF',
    ts_type: 'Buffer'
  },
  TIMESTAMP: {
    value: (n?: number) => `TIMESTAMP${n ? `(${n})` : ''}` as const,
    example: '2024-07-19 13:45:30.123456',
    ts_type: 'Date'
  },
  TIMESTAMPTZ: {
    value: (n?: number) => `TIMESTAMPTZ${n ? `(${n})` : ''}` as const,
    example: '2024-07-19 13:45:30.123456+00',
    ts_type: 'Date'
  },
  DATE: {
    value: () => 'DATE' as const,
    example: '2024-07-19',
    ts_type: 'Date'
  },
  TIME: {
    value: (n?: number) => `TIME${n ? `(${n})` : ''}` as const,
    example: '13:45:30',
    ts_type: 'string'
  },
  TIMETZ: {
    value: (n?: number) => `TIMETZ${n ? `(${n})` : ''}` as const,
    example: '13:45:30+00',
    ts_type: 'string'
  },
  INTERVAL: {
    value: () => 'INTERVAL' as const,
    example: '1 year 2 months 3 days',
    ts_type: 'string'
  },
  BOOLEAN: {
    value: () => 'BOOLEAN' as const,
    example: 'TRUE',
    ts_type: 'boolean'
  },
  UUID: {
    value: () => 'UUID' as const,
    example: '123e4567-e89b-12d3-a456-426614174000',
    ts_type: 'string'
  },
  JSON: {
    value: () => 'JSON' as const,
    example: '{"key": "value"}',
    ts_type: 'object'
  },
  JSONB: {
    value: () => 'JSONB' as const,
    example: '{"key": "value"}',
    ts_type: 'object'
  },
  POINT: {
    value: () => 'POINT' as const,
    example: '(1.5, 2.5)',
    ts_type: 'string'
  },
  LINE: {
    value: () => 'LINE' as const,
    example: '{1, 2, 3}',
    ts_type: 'string'
  },
  LSEG: {
    value: () => 'LSEG' as const,
    example: '[(1, 2), (3, 4)]',
    ts_type: 'string'
  },
  BOX: {
    value: () => 'BOX' as const,
    example: '(2, 4), (3, 5)',
    ts_type: 'string'
  },
  PATH: {
    value: () => 'PATH' as const,
    example: '(1, 2), (3, 4), (5, 6)',
    ts_type: 'string'
  },
  POLYGON: {
    value: () => 'POLYGON' as const,
    example: '((1, 2), (3, 4), (5, 6), (1, 2))',
    ts_type: 'string'
  },
  CIRCLE: {
    value: () => 'CIRCLE' as const,
    example: '< (2, 2), 5 >',
    ts_type: 'string'
  },
  CIDR: {
    value: () => 'CIDR' as const,
    example: '192.168.100.128/25',
    ts_type: 'string'
  },
  INET: {
    value: () => 'INET' as const,
    example: '192.168.1.1',
    ts_type: 'string'
  },
  MACADDR: {
    value: () => 'MACADDR' as const,
    example: '08:00:2b:01:02:03',
    ts_type: 'string'
  },
  BIT: {
    value: (n?: number) => `BIT(${n ? `(${n})` : ''})` as const,
    example: '1',
    ts_type: 'string'
  },
  VARBIT: {
    value: (n?: number) => `VARBIT${n ? `(${n})` : ''}` as const,
    example: '10101',
    ts_type: 'string'
  },
  TSVECTOR: {
    value: () => 'TSVECTOR' as const,
    example: 'a fat cat',
    ts_type: 'string'
  },
  TSQUERY: {
    value: () => 'TSQUERY' as const,
    example: 'fat & cat',
    ts_type: 'string'
  }
} as const;

export type PGColumnDataTypeExample =
  (typeof PGColumnDataType)[keyof typeof PGColumnDataType]['example'];
export type PGColumnDataTypeValueFunction =
  (typeof PGColumnDataType)[keyof typeof PGColumnDataType]['value'];
export type PGColumnDataTypeValue = ReturnType<PGColumnDataTypeValueFunction>;
export type PGColumnDataType = keyof typeof PGColumnDataType;
