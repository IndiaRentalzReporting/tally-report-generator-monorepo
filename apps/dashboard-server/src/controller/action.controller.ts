import { NextFunction, Request, Response } from 'express';
import {
  ActionInsert,
  ActionSelect
} from '@trg_package/schemas-dashboard/types';
import { ReadError } from '@trg_package/errors';

export const readAll = async (
  req: Request<object, object, object, Partial<ActionSelect>>,
  res: Response<{ actions: ActionSelect[] }>,
  next: NextFunction
) => {
  try {
    const actions = await req.services.action?.findMany({
      ...req.query,
    }).catch((e) => {
      if (e instanceof ReadError) return [];
      throw e;
    });
    return res.json({ actions });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<ActionSelect, 'id'>, object, Partial<ActionSelect>>,
  res: Response<{ action: ActionSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const action = await req.services.action?.updateOne({ id }, req.body);
    return res.json({ action });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<ActionSelect, 'id'>>,
  res: Response<{ action: ActionSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const action = await req.services.action?.deleteOne({ id });
    return res.json({ action });
  } catch (e) {
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, ActionInsert>,
  res: Response<{ action: ActionSelect }>,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const action = await req.services.action?.createOne({
      ...data,
      name: data.name.toUpperCase() as ActionSelect['name']
    });
    return res.json({ action });
  } catch (e) {
    return next(e);
  }
};
