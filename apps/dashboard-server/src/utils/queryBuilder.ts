import { BadRequestError } from '@trg_package/errors';
import { FilterOperations, ReportInsert, ReportSelect } from '@trg_package/schemas-reporting/types';

/**
 *
 * @param param : any
 * @returns Value with the required quotes
 */
function getEscapedValue(param : any) {
  if (Array.isArray(param)) {
    param = param.map((e) => getEscapedValue(e));
    return `(${param.join(',')})`;
  }
  if (typeof param === 'number') {
    return param;
  }

  return `'${param}'`;
}

/**
 *
 * @param column
 * @returns The tablename.columnname together for the query
 */
function getColumnName(column : NonNullable<ReportInsert['columns']>[number]['column']) {
  return `${column.tablealias}."${column.name}"`;
}

export function getColumnQuery(columns : ReportInsert['columns']) {
  const query: string[] = [];
  columns?.forEach((ele) => {
    const { column } = ele;
    if (ele.operation) query.push(`${ele.operation}(${getColumnName(column)}) as "${column.alias}"`);
    else query.push(`${getColumnName(column)} as \\"${column.alias}\\"`);
  });
  return query.join(', ');
}

export function getConditionQuery(conditions : ReportInsert['conditions']) {
  const query : string[] = [];
  conditions?.forEach((condition) => {
    const join = conditions[0] === condition ? ' ' : (condition.join ?? 'AND');
    if (!condition.params) query.push(`${join} ${getColumnName(condition.column)} ${condition.operator}`);
    else if (condition.params && 'value' in condition.params) query.push(`${join} ${getColumnName(condition.column)} ${condition.operator} ${getEscapedValue(condition.params.value)}`);
    else if (condition.params && 'from' in condition.params && 'to' in condition.params) query.push(`${join} ${getColumnName(condition.column)} ${condition.operator} ${getEscapedValue(condition.params.from)} AND ${getEscapedValue(condition.params.to)}`);
  });

  return `WHERE ${query.join(' ')}`;
}
export function getGroupByQuery(columns : ReportSelect['groupBy']) {
  const query : string[] = [];
  columns?.forEach((column) => {
    query.push(`${getColumnName(column.column)}`);
  });

  return `GROUP BY ${query.join(', ')}`;
}

type FilterConfig = NonNullable<NonNullable<ReportInsert['queryConfig']>['filters']>;
export function getFilterConfig(filters : NonNullable<ReportInsert['filters']>) : FilterConfig {
  const filterConfig : FilterConfig = {};
  filters.forEach((e) => {
    let dataSource : FilterConfig[string]['dataSource'] = null;
    let queryCondition = '';

    const columnName = e.columnName ?? getColumnName(e.column);
    if (e.filterType === 'select') {
      dataSource = `SELECT ${getColumnName(e.column)} as label,${getColumnName(e.column)} as value FROM public."${e.column.table}" "${e.column.tablealias}"`;
      queryCondition = `
        ${columnName} IN {value}`;
    } else if (e.filterType === 'search' || e.column.type === 'string') {
      queryCondition = `${columnName} LIKE {value}`;
    } else {
      queryCondition = `${columnName} `;
    }

    filterConfig[e.column.alias] = {
      dataSource,
      queryCondition,
      filterType: e.filterType,
      heading: e.column.heading,
      conditionType: e.conditionType ?? 'where'
    };
  });

  return filterConfig;
}
export function getQueryConfig(tableQuery: string, report: Partial<ReportSelect>) : ReportInsert['queryConfig'] {
  const {
    columns,conditions,groupBy,filters
  } = report;

  const columnQuery = (columns ?? []).length > 0 ? getColumnQuery(columns) : ' * ';
  const condtionsQuery = (conditions ?? []).length > 0 ? getConditionQuery(conditions) : ' ';
  const groupByQuery = (groupBy ?? []).length > 0 ? getGroupByQuery(groupBy ?? []) : ' ';
  const filterConfig = (filters ?? []).length > 0 ? getFilterConfig(filters ?? []) : null;


  const query = `SELECT ${columnQuery} FROM ${tableQuery} ${condtionsQuery} {WHERE} ${groupByQuery} {HAVING} {LIMIT}`;

  const columnArr : NonNullable<ReportSelect['queryConfig']>['columns'] = [];
  columns?.forEach((e) => {
    columnArr.push({ heading: e.column.heading,alias: e.column.alias });
  });

  return {
    dataSource: query,
    columns: columnArr,
    filters: filterConfig
  };
}

export async function getFilterQuery(filters : { [K : string] : typeof FilterOperations[keyof typeof FilterOperations] ['params'] },filterConfig : NonNullable<NonNullable<ReportSelect['queryConfig']>['filters']>) {
  const conditionArr : { having: string[],where: string[] } = { having: [],where: [] };

  Object.entries(filters).forEach(([filterName,params]) => {
    if (filterName in filterConfig) {
      const config = filterConfig[filterName];
      let query = config?.queryCondition ?? '';

      if('from' in params && 'to' in params)
      {
        query = `${query} between {from} and {to}`;
      }
      else if('from' in params)
      {
        query = `${query} <= {from}`;
      }
      else if('to' in params)
      {
        query = `${query} <= {to}`;
      }
      Object.entries(params).forEach(([e,value]) => {
        query = query.replace(`{${e.toLowerCase()}}`,getEscapedValue(value).toString());
      });
      conditionArr[config?.conditionType ?? 'where'].push(query);
    } else { throw new BadRequestError('Filter does no exist in report'); }
  });

  return {
    havingQuery: conditionArr.having.length > 0 ? `HAVING ${conditionArr.having.join(' AND ')}` : '',
    whereQuery: conditionArr.where.length > 0 ? `${conditionArr.where.join(' AND ')}` : ''
  };
}
