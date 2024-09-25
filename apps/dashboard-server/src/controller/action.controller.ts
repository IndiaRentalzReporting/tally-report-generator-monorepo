import { NextFunction, Request, Response } from 'express';
import {
  ActionInsert,
  ActionSelect
} from '@trg_package/schemas-dashboard/types';

export const readAll = async (
  req: Request<object, Partial<ActionSelect>>,
  res: Response<{ actions: ActionSelect[] }>,
  next: NextFunction
) => {
  try {
    const actions = await req.actionService.findMany({
      ...req.query
    });
    return res.json({ actions });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<ActionSelect, 'id'>, object, Pick<ActionInsert, 'name'>>,
  res: Response<{ action: ActionSelect }>,
  next: NextFunction
) => {
  try {
    const action = await req.actionService.updateOne(req.params.id, req.body);
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
    const action = await req.actionService.deleteOne(req.params.id);
    return res.json({ action });
  } catch (e) {
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, Pick<ActionInsert, 'name'>>,
  res: Response<{ action: ActionSelect }>,
  next: NextFunction
) => {
  try {
    const data = req.body;
    const action = await req.actionService.createOne({
      ...data,
      name: data.name.toUpperCase() as ActionSelect['name']
    });
    return res.json({ action });
  } catch (e) {
    return next(e);
  }
};
