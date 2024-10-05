import { NextFunction, Request, Response } from 'express';
import {
  ReportInsert,
  ReportSelect
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

export const readOne = async (
  req: Request<Pick<ReportSelect, 'id'>, ReportResponse, Partial<ReportSelect>>,
  res: Response<ReportResponse>,
  next: NextFunction
) => {
  try {
    const report = await req.reportService.findOne({
      ...req.query
    });
    return res.json({ report });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async <T extends { reports: ReportSelect[] }>(
  req: Request<object, T>,
  res: Response<T>,
  next: NextFunction
) => {
  try {
    const reports = await req.reportService.findMany();
    return res.json({ reports } as T);
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
