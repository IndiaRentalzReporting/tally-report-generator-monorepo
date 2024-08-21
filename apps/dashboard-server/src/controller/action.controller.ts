import { NextFunction, Request, Response } from 'express';
import {
  ActionInsert,
  ActionSelect
} from '@trg_package/dashboard-schemas/types';

export const readAll = async (
  req: Request,
  res: Response<{ actions: ActionSelect[] }>,
  next: NextFunction
) => {
  try {
    const actions = await req.actionService.findMany({});
    return res.json({ actions });
  } catch (e) {
    console.error('Could not fetch all actions');
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<ActionSelect, 'id'>>,
  res: Response<{ action: ActionSelect }>,
  next: NextFunction
) => {
  try {
    const action = await req.actionService.findOne({ id: req.params.id });
    return res.json({ action });
  } catch (e) {
    console.error('Action does not exist!');
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
    console.error('Could not update action');
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
    console.error('Could not delete action');
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
    req.permissionService.extendSuperuserActions(action.id);
    return res.json({ action });
  } catch (e) {
    console.error('Could not create an action');
    return next(e);
  }
};
