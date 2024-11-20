import { NextFunction, Request, Response } from 'express';
import { ReportInsert, ReportSelect } from '@trg_package/schemas-reporting/types';

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
