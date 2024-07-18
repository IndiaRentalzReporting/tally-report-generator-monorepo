export const ColumnType = {
  SMALLINT: { value: () => 'SMALLINT' as const, example: '1' },
  INTEGER: { value: () => 'INTEGER' as const, example: '12345' },
  BIGINT: { value: () => 'BIGINT' as const, example: '123456789012345' },
  DECIMAL: { value: () => 'DECIMAL' as const, example: '12345.67' },
  NUMERIC: {
    value: (p?: number, s?: number) =>
      `NUMERIC${p && s ? `(${p}, ${s})` : ''}` as const,
    example: '12345.67'
  },
  REAL: { value: () => 'REAL' as const, example: '12345.67' },
  DOUBLE_PRECISION: {
    value: () => 'DOUBLE PRECISION' as const,
    example: '12345.6789'
  },
  SERIAL: { value: () => 'SERIAL' as const, example: '1' },
  BIGSERIAL: { value: () => 'BIGSERIAL' as const, example: '1' },
  MONEY: { value: () => 'MONEY' as const, example: '$12345.67' },
  CHAR: {
    value: (n?: number) => `CHAR${n ? `(${n})` : ''}` as const,
    example: 'A'
  },
  VARCHAR: {
    value: (n?: number) => `VARCHAR${n ? `(${n})` : ''}` as const,
    example: 'Example text'
  },
  TEXT: {
    value: () => 'TEXT' as const,
    example: 'This is a text field with a lot of text'
  },
  BYTEA: { value: () => 'BYTEA' as const, example: '\\xDEADBEEF' },
  TIMESTAMP: {
    value: (n?: number) => `TIMESTAMP${n ? `(${n})` : ''}` as const,
    example: '2024-07-19 13:45:30.123456'
  },
  TIMESTAMPTZ: {
    value: (n?: number) => `TIMESTAMPTZ${n ? `(${n})` : ''}` as const,
    example: '2024-07-19 13:45:30.123456+00'
  },
  DATE: { value: () => 'DATE' as const, example: '2024-07-19' },
  TIME: {
    value: (n?: number) => `TIME${n ? `(${n})` : ''}` as const,
    example: '13:45:30'
  },
  TIMETZ: {
    value: (n?: number) => `TIMETZ${n ? `(${n})` : ''}` as const,
    example: '13:45:30+00'
  },
  INTERVAL: {
    value: () => 'INTERVAL' as const,
    example: '1 year 2 months 3 days'
  },
  BOOLEAN: { value: () => 'BOOLEAN' as const, example: 'TRUE' },
  UUID: {
    value: () => 'UUID' as const,
    example: '123e4567-e89b-12d3-a456-426614174000'
  },
  JSON: { value: () => 'JSON' as const, example: '{"key": "value"}' },
  JSONB: { value: () => 'JSONB' as const, example: '{"key": "value"}' },
  POINT: { value: () => 'POINT' as const, example: '(1.5, 2.5)' },
  LINE: { value: () => 'LINE' as const, example: '{1, 2, 3}' },
  LSEG: { value: () => 'LSEG' as const, example: '[(1, 2), (3, 4)]' },
  BOX: { value: () => 'BOX' as const, example: '(2, 4), (3, 5)' },
  PATH: { value: () => 'PATH' as const, example: '(1, 2), (3, 4), (5, 6)' },
  POLYGON: {
    value: () => 'POLYGON' as const,
    example: '((1, 2), (3, 4), (5, 6), (1, 2))'
  },
  CIRCLE: { value: () => 'CIRCLE' as const, example: '< (2, 2), 5 >' },
  CIDR: { value: () => 'CIDR' as const, example: '192.168.100.128/25' },
  INET: { value: () => 'INET' as const, example: '192.168.1.1' },
  MACADDR: { value: () => 'MACADDR' as const, example: '08:00:2b:01:02:03' },
  BIT: {
    value: (n?: number) => `BIT(${n ? `(${n})` : ''})` as const,
    example: '1'
  },
  VARBIT: {
    value: (n?: number) => `VARBIT${n ? `(${n})` : ''}` as const,
    example: '10101'
  },
  TSVECTOR: { value: () => 'TSVECTOR' as const, example: 'a fat cat' },
  TSQUERY: { value: () => 'TSQUERY' as const, example: 'fat & cat' }
} as const;

export type ModuleColumns = ReturnType<
  (typeof ColumnType)[keyof typeof ColumnType]['value']
>;
