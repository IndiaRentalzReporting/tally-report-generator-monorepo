import { ReportInsert, ReportSelect } from '@trg_package/schemas-reporting/types';

function getEscapedValue(param : any) {
  if (Array.isArray(param)) {
    param.map((e) => getEscapedValue(e));
    return `(${param.join(',')})`;
  }
  if (typeof param === 'number') {
    return param;
  }

  return `'${param}'`;
}

function getColumnName(column : NonNullable<ReportInsert['columns']>[number]['column']) {
  return `${column.tablealias}."${column.name}"`;
}
export function getColumnQuery(columns : ReportInsert['columns']) {
  const query: string[] = [];
  columns?.map((ele) => {
    const { column } = ele;
    if (ele.operation) query.push(`${ele.operation}(${getColumnName(column)}) as "${column.alias}"`);
    else query.push(`${getColumnName(column)} as \\"${column.alias}\\"`);
  });
  return query.join(', ');
}

export function getConditionQuery(conditions : ReportInsert['conditions']) {
  const query : string[] = [];
  conditions?.map((condition) => {
    if (condition.params === null) query.push(`${condition.join} ${condition.operator}(${getColumnName(condition.column)})`);
    else if (condition.params && 'value' in condition.params) query.push(`${condition.join} ${getColumnName(condition.column)} ${condition.operator} ${getEscapedValue(condition.params.value)}`);
    else if (condition.params && 'from' in condition.params && 'to' in condition.params) query.push(`${condition.join} ${getColumnName(condition.column)} ${condition.operator} ${getEscapedValue(condition.params.from)} AND ${getEscapedValue(condition.params.to)}`);
  });

  return `WHERE ${query.join(' ')}`;
}
export function getGroupByQuery(columns : ReportSelect['groupBy']) {
  const query : string[] = [];
  columns?.map((column) => {
    query.push(`${getColumnName(column.column)}`);
  });

  return `GROUP BY ${query.join(', ')}`;
}

export function getQueryConfig(tableQuery : string, report : ReportInsert) : ReportInsert['queryConfig'] {
  const {
    columns,conditions,groupBy,filters
  } = report;

  const columnQuery = columns ? getColumnQuery(columns) : ' * ';
  const condtionsQuery = conditions ? getConditionQuery(conditions) : ' ';
  const groupByQuery = groupBy ? getGroupByQuery(groupBy) : ' ';

  const query = `SELECT ${columnQuery} FROM ${tableQuery} ${condtionsQuery} ${groupByQuery}`;

  const columnArr : NonNullable<ReportSelect['queryConfig']>['columns'] = [];
  columns?.map((e) => {
    columnArr.push({ heading: e.heading,alias: e.column.alias });
  });

  return {
    dataSource: query,
    columns: columnArr,
    filters: []
  };
}
