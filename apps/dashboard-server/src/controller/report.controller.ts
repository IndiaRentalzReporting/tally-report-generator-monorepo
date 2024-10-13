import { NextFunction, Request, Response } from 'express';
import {
  ColumnSelect,
  ReportInsert,
  ReportSelect,
  TableSelect
} from '@trg_package/schemas-reporting/types';

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
    const report = await req.reportService.saveReport({ ...req.body });
    return res.json({ report } as ReportResponse);
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object, Partial<ReportSelect>>,
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
  req: Request<Pick<ReportSelect, 'id'>, ReportResponse, ReportInsert>,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    const report = await req.reportService.saveReport(
      req.body,
      req.params.id as any
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

export const getColumns = async (
  req: Request<{ tableId: TableSelect['id'] }>,
  res: Response<{ columns: ColumnSelect[] }>,
  next: NextFunction
) => {
  try {
    await req.tableService.findOne({ id: req.params.tableId });
    const columns = await req.columnService.getAllColumns(req.params.tableId);
    return res.json({ columns });
  } catch (e) {
    return next(e);
  }
};

export const getTables = async (
  req: Request<object, Partial<TableSelect>>,
  res: Response<{ tables: TableSelect[] }>,
  next: NextFunction
) => {
  try {
    const tables = await req.tableService.findMany({
      ...req.query
    });
    return res.json({ tables });
  } catch (e) {
    return next(e);
  }
};
