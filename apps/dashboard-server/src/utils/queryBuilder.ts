import { BadRequestError } from '@trg_package/errors';
import { FilterOptions, ReportInsert, ReportSelect } from '@trg_package/schemas-reporting/types';

/**
 *
 * @param param : any
 * @returns Value with the required quotes
 */
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
    const join = condition.join ?? '';
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

    if (e.filterType === 'select') {
      dataSource = `SELECT ${getColumnName(e.column)} as label,${getColumnName(e.column)} as value FROM public."${e.column.table}" "${e.column.tablealias}"`;
      queryCondition = `
        "${e.column.alias}" IN (WITH RECURSIVE children_cte AS (
          SELECT "${e.column.name}" as name, parent
          FROM public."${e.column.table}"
          WHERE parent IN {value}  
          UNION ALL
          SELECT t.name, t.parent
          FROM  public."${e.column.table}" t
          INNER JOIN children_cte c
          ON t.parent = c.name
          )
          SELECT name
          FROM children_cte)`;
    } else if (e.filterType === 'search') {
      queryCondition = `"${e.column.alias}" LIKE {value}`;
    } else {
      queryCondition = `"${e.column.alias}" BETWEEN {from} and {to}`;
    }

    filterConfig[e.column.alias] = {
      dataSource,
      queryCondition,
      filterType: e.filterType,
      heading: e.column.heading
    };
  });

  return filterConfig;
}
export function getQueryConfig(tableQuery : string, report : ReportInsert) : ReportInsert['queryConfig'] {
  const {
    columns,conditions,groupBy,filters
  } = report;

  const columnQuery = (columns ?? []).length > 0 ? getColumnQuery(columns) : ' * ';
  const condtionsQuery = (conditions ?? []).length > 0 ? getConditionQuery(conditions) : ' ';
  const groupByQuery = (groupBy ?? []).length > 0 ? getGroupByQuery(groupBy ?? []) : ' ';
  const filterConfig = (filters ?? []).length > 0 ? getFilterConfig(filters ?? []) : null;

  const query = `SELECT ${columnQuery} FROM ${tableQuery} ${condtionsQuery} ${groupByQuery}`;

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

export async function getFilterQuery(filters : { [K : string] : typeof FilterOptions[keyof typeof FilterOptions] ['params'] },filterConfig : NonNullable<NonNullable<ReportSelect['queryConfig']>['filters']>) {
  const conditionArr : string[] = [];

  Object.entries(filters).forEach(([filterName,params]) => {
    if (filterName in filterConfig) {
      const config = filterConfig[filterName];
      let query = config?.queryCondition ?? '';

      Object.entries(params).forEach(([e,value]) => {
        query = query.replace(`{${e.toLowerCase()}}`,getEscapedValue(value).toString());
      });

      conditionArr.push(query);
    } else { throw new BadRequestError('Filter does no exist in report'); }
  });

  return ` HAVING ${conditionArr.join(' AND ')}`;
}
