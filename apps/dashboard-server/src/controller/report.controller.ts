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
  GeneratedReportColumns,
  ReportAccessInsert,
  ReportExportScheduleInsert,
  ReportExportScheduleSelect,
  ReportAccessSelect,
  ReportScheduleUsersSelect,
  ReportScheduleUsersInsert
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
  ReportInsert
  >,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    const report = await req.services.report.createOne({ ...req.body });
    return res.json({ report } as ReportResponse);
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object, object, object, Partial<ReportSelect>>,
  res: Response<{ reports: ReportSelect[] }>,
  next: NextFunction
) => {
  try {
    const reports = await req.services.report.findMany({
      ...req.query
    });
    return res.json({ reports });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<ReportSelect, 'id'>, object, Partial<ReportSelect>>,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    let report = await req.services.report.updateOne(
      { id: req.params.id as any },
      req.body
    );

    const splitTables = req.body.tables?.flatMap((item) => item.split('_'));
    const tables = [...new Set(splitTables)];
    const tableQuery = await req.services.report.getTableQuery(report.baseEntity as any,tables);

    const reportQueryConfig = getQueryConfig(tableQuery,req.body);
    report = await req.services.report.updateOne(
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
    const report = await req.services.report.deleteOne({ id });
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
    const table = await req.services.table.findOne({ id: req.params.tableId });
    const columns = await req.services.column.getAllColumns(req.params.tableId);
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
  const column = await req.services.column.findOne({ id: columnId });
  const table = await req.services.table.findOne({ id: column.tableId });

  const selectData = await req.services.report.runConfigQuery<DataSelectType>(`
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
    const tables = await req.services.table.findMany();
    return res.json({ tables });
  } catch (e) {
    return next(e);
  }
};

export const getReportData = async (
  req : Request<
  Pick<ReportSelect,'id'>,
    object,
    object,
  {
    pageSize: number,
    pageIndex : number,
    filters? : RuntimeFilters
  }
  >,
  res : Response<{ data: Array<GeneratedReportData> ,totalCount : number }>,
  next: NextFunction
) => {
  try {
    const report = await req.services.report.findOne({
      id: req.params.id
    });
    const { queryConfig } = report;

    if (!report.columns) {
      throw new CustomError('Report Config is missing columns',400);
    }

    if (queryConfig === null || queryConfig.dataSource === '') {
      throw new CustomError('This report is not configured yet, please configure the report to view it',400);
    }

    const {
      filters,
      pageIndex,
      pageSize
    } = req.query;

    let { whereQuery,havingQuery } = Object.entries(filters ?? {}).length > 0 && filters ? await getFilterQuery(filters,queryConfig.filters ?? {}) : { whereQuery: '',havingQuery: '' };

    if (whereQuery !== '') {
      whereQuery = queryConfig.dataSource.match(/\b WHERE \b/) ? ` AND ${whereQuery}` : ` WHERE ${whereQuery}`;
    }

    const limitQuery = pageIndex || pageSize ? `LIMIT ${pageSize} OFFSET ${(pageSize * (pageIndex))}` : '';
    const query = queryConfig.dataSource.replace('{WHERE}',whereQuery).replace('{HAVING}',havingQuery);
    const data = await req.services.report.runConfigQuery<Array<GeneratedReportData>>(query.replace('{LIMIT}',limitQuery));
    const totalCount = await req.services.report.runConfigQuery<Array<{ totalCount : number }>>(`SELECT COUNT(*) as "totalCount" FROM (${query.replace('{LIMIT}','')})`);

    return res.json({
      data,
      totalCount: totalCount[0]?.totalCount ?? 0
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
    const report = await req.services.report.findOne({ id: req.params.id });
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
    const report = await req.services.report.findOne({ id: req.params.id });
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
        filterData = await req.services.report.runConfigQuery<NonNullable<GeneratedReportFilters['data']>>(config.dataSource);
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

export const updateAccess = async (
  req : Request<Pick<ReportSelect,'id'>,object,{ users:Array<ReportAccessInsert['userId']> }>,
  res : Response<{ reportAccess : ReportAccessSelect[] }>,
  next : NextFunction
) => {
  const { id: reportId } = req.params;

  const { users } = req.body;
  const data : ReportAccessInsert[] = [];

  users.forEach((element) => {
    data.push({
      reportId,
      userId: element
    });
  });
  try {
    await req.services.reportAccess.deleteOne({ reportId });
  } catch (e) {
  } finally {
    const reportAccess = await req.services.reportAccess.createMany(data);
    return res.json({ reportAccess });
  }
};

export const updateSchedule = async (
  req : Request<Pick<ReportSelect,'id'>,object,{ schedule : ReportExportScheduleInsert,users : Array<ReportScheduleUsersInsert['userId']> }>,
  res : Response<{ schedule : ReportExportScheduleSelect,users:ReportScheduleUsersSelect[] }>,
  next : NextFunction
) => {
  const { id: reportId } = req.params;

  const { schedule,users } = req.body;

  let reportSchedule : ReportExportScheduleSelect;
  let scheduleUsers : ReportScheduleUsersSelect[] = [];
  schedule.reportId = reportId;
  schedule.nextRun = new Date();
  try {
    await req.services.reportExportSchedule.findOne({ reportId });
    reportSchedule = await req.services.reportExportSchedule.updateOne({ reportId },schedule);
  } catch (e) {
    reportSchedule = await req.services.reportExportSchedule.createOne(schedule);
  }

  try {
    await req.services.reportScheduleUsers.deleteOne({ scheduleId: reportSchedule.id });
  } catch (e) {} finally {
    const data : ReportScheduleUsersInsert[] = [];
    users?.forEach((element) => {
      data.push({
        userId: element,
        scheduleId: reportSchedule.id
      });
    });
    if (data.length > 0) scheduleUsers = await req.services.reportScheduleUsers.createMany(data);
  }

  return res.json({ schedule: reportSchedule,users: scheduleUsers });
};

export const getUsersWithAccess = async (
  req : Request<Pick<ReportSelect,'id'>>,
  res : Response<{ users : ReportAccessSelect[] }>,
  next : NextFunction
) => {
  const { id: reportId } = req.params;
  let users : ReportAccessSelect[] = [];
  try {
    users = await req.services.reportAccess.findMany(
      { reportId },
      {
        with: {
          user: true
        }
      }
    );
  } catch (e) {
  } finally {
    return res.json({ users });
  }
};
