import { NextFunction, Request, Response } from 'express';
import { TableSelect } from '@trg_package/schemas-reporting/types';

export const readAll = async (
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
