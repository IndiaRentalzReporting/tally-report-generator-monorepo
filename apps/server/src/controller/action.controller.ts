import { NextFunction, Request, Response } from 'express';
import { ActionInsert, ActionSchema, ActionSelect } from '../models/schema';
import BaseService from '../services/BaseService';
import PermissionService from '../services/PermissionService';
import db from '../models';

const ActionService = new BaseService(ActionSchema, db.query.ActionSchema);

export const readAll = async (
  req: Request,
  res: Response<{ actions: ActionSelect[] }>,
  next: NextFunction
) => {
  try {
    const actions = await ActionService.findAll();
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
    const action = await ActionService.findOne({ id: req.params.id });
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
    const action = await ActionService.updateOne(req.params.id, req.body);
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
    const action = await ActionService.deleteOneById(req.params.id);
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
    const action = await ActionService.createOne({
      ...data,
      name: data.name.toUpperCase() as ActionSelect['name']
    });
    await PermissionService.extendSuperuserActions(action.id);
    return res.json({ action });
  } catch (e) {
    console.error('Could not create an action');
    return next(e);
  }
};
