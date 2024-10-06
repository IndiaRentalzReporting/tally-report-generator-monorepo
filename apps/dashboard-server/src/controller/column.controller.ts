import {
  ColumnSelect,
  TableSelect
} from '@trg_package/schemas-reporting/types';
import { NextFunction, Request, Response } from 'express';

export const readAll = async (
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
