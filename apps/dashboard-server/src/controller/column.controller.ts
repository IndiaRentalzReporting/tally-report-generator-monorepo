import { ColumnSelect, TableSelect } from '@trg_package/schemas-reporting/types';
import { NextFunction, Request, Response } from 'express';

export const readAll = async <ResObject extends { columns : ColumnSelect[] }>(
  req : Request<{ tableId:TableSelect['id'] },ResObject>,
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
