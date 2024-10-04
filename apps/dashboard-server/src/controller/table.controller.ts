import { NextFunction, Request, Response } from 'express';
import { TableSelect } from '@trg_package/schemas-reporting/types';

export const readAll = async <T extends { tables : TableSelect[] }>(
  req : Request<object,T>,
  res : Response<T>,
  next : NextFunction
) => {
  try {
    const tables = (await req.tableService.findMany());
    return res.json({ tables } as T);
  } catch (e) {
    return next(e);
  }
};
