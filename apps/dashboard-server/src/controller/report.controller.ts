import { NextFunction, Request, Response } from 'express';
import {
  DetailedColumnSelect,
  ReportInsert,
  ReportSelect,
  TableSelect,
  GeneratedReportFilters,
  RuntimeFilters,
  ColumnSelect,
  GeneratedReportData,
  GeneratedReportColumns
} from '@trg_package/schemas-reporting/types';
import { BadRequestError, CustomError } from '@trg_package/errors';
import { getFilterQuery, getQueryConfig } from '@/utils/queryBuilder';

type ReportResponse<isArray extends boolean = false> = isArray extends true
  ? { reports: Partial<ReportSelect>[] }
  : { report: Partial<ReportSelect> };

export const createOne = async (
  req: Request<
    object,
  ReportResponse,
  Pick<ReportInsert, 'name' | 'baseEntity' | 'description'>
  >,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    const report = await req.reportService.createOne({ ...req.body });
    return res.json({ report } as ReportResponse);
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object, object,object,Partial<ReportSelect>>,
  res: Response<{ reports: ReportSelect[] }>,
  next: NextFunction
) => {
  try {
    const reports = await req.reportService.findMany({
      ...req.query
    });
    return res.json({ reports });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<ReportSelect, 'id'>, object, ReportInsert>,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    let report = await req.reportService.updateOne(
      { id: req.params.id as any },
      req.body
    );

    const splitTables = req.body.tables?.flatMap((item) => item.split('_'));
    const tables = [...new Set(splitTables)];
    const tableQuery = await req.reportService.getTableQuery(report.baseEntity as any,tables);

    const reportQueryConfig = getQueryConfig(tableQuery,req.body);
    report = await req.reportService.updateOne(
      { id: req.params.id as any },
      { queryConfig: reportQueryConfig }
    );

    return res.json({ report });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<ReportSelect, 'id'>>,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const report = await req.reportService.deleteOne({ id });
    return res.json({ report });
  } catch (e) {
    return next(e);
  }
};

export const getAllColumns = async <ResObject extends { columns : DetailedColumnSelect[] }>(
  req : Request<{ tableId:TableSelect['id'] },object>,
  res : Response<ResObject>,
  next : NextFunction
) => {
  try {
    const table = await req.tableService.findOne({ id: req.params.tableId });
    const columns = await req.columnService.getAllColumns(req.params.tableId);
    return res.json({ columns } as ResObject);
  } catch (e) {
    next(e);
  }
};

type DataSelectType = Array<{ label:string,value:string }>;
export const getSelectData = async (
  req: Request<Pick<ColumnSelect,'id'>,object,object>,
  res : Response<{ data: DataSelectType }>,
  next : NextFunction
) => {
  const { id: columnId } = req.params;
  const column = await req.columnService.findOne({ id: columnId });
  const table = await req.tableService.findOne({ id: column.tableId });

  const selectData = await req.reportService.runConfigQuery<DataSelectType>(`
    SELECT tb."${column.name}" as label,tb."${column.name}" as value from public."${table.name}" tb
  `);
  if (!selectData || selectData.length === 0) { throw new BadRequestError('No Data found in the table'); }
  return res.json({ data: selectData });
};

export const getAllTables = async (
  req : Request,
  res : Response<{
    tables: TableSelect[]
  }>,
  next : NextFunction
) => {
  try {
    const tables = await req.tableService.findMany();
    return res.json({ tables });
  } catch (e) {
    return next(e);
  }
};

export const getReportData = async (
  req : Request<Pick<ReportSelect,'id'>,object,object,{ pageSize: number,pageIndex : number,filters? : RuntimeFilters }>,
  res : Response<{ data: Array<GeneratedReportData> }>,
  next: NextFunction
) => {
  try {
    const report = await req.reportService.findOne({ id: req.params.id });
    const { queryConfig } = report;

    if (!report.columns) {
      throw new CustomError('Report Config is missing columns',400);
    }

    if (queryConfig === null || queryConfig.dataSource === '') throw new CustomError('This report is not configured yet, please configure the report to view it',400);

    const {
      filters,pageIndex,pageSize
    } = req.query;

    const { whereQuery,havingQuery } = filters ? await getFilterQuery(filters,queryConfig.filters ?? {}) : { whereQuery: '',havingQuery: '' };

    const limitQuery = pageIndex || pageSize ? `LIMIT ${pageSize} OFFSET ${(pageSize * (pageIndex - 1))}` : '';
    const data = await req.reportService.runConfigQuery<Array<GeneratedReportData>>(queryConfig.dataSource.replace('{WHERE}',whereQuery).replace('{HAVING}',havingQuery).replace('{LIMIT}',limitQuery));

    return res.json({
      data
    });
  } catch (e) {
    return next(e);
  }
};

export const getReportColumns = async (
  req : Request<Pick<ReportSelect,'id'>>,
  res : Response<{ columns: Array<GeneratedReportColumns> }>,
  next: NextFunction
) => {
  try {
    const report = await req.reportService.findOne({ id: req.params.id });
    const { queryConfig } = report;

    if (!report.columns || !queryConfig) {
      throw new CustomError('Report Config is missing columns',400);
    }

    return res.json({
      columns: queryConfig?.columns ?? []
    });
  } catch (e) {
    return next(e);
  }
};

export const getReportFilters = async (
  req : Request<Pick<ReportSelect,'id'>>,
  res : Response<{ filters : Array<GeneratedReportFilters> }>,
  next : NextFunction
) => {
  try {
    const report = await req.reportService.findOne({ id: req.params.id });
    if (!report.queryConfig) {
      throw new BadRequestError('Query Config Does not exist');
    }
    const { filters } = report.queryConfig;
    if (!filters) {
      return res.json({ filters: [] });
    }

    const filterArr : Array<GeneratedReportFilters> = [];

    for (const [alias, config] of Object.entries(filters)) {
      let filterData = null;
      if (config.dataSource) {
        filterData = await req.reportService.runConfigQuery<NonNullable<GeneratedReportFilters['data']>>(config.dataSource);
      }
      filterArr.push({
        data: filterData,
        fieldName: alias,
        filterType: config.filterType,
        label: config.heading
      });
    }

    return res.json({ filters: filterArr });
  } catch (e) {
    return next(e);
  }
};
