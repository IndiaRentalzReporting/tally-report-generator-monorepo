import { NextFunction, Request, Response } from 'express';
import { ActionSchema, ActionSelect, ModuleSchema } from '../models/schema';
import { toTitleCase } from '../utils';
import BaseService from '../services/BaseService';
import db from '../models';

declare global {
  namespace Express {
    interface Request {
      module?: string;
      action?: string;
    }
  }
}

export const attachModuleActionData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url } = req;
  const [_, module, action] = url.split('/');
  const ActionService = new BaseService(ActionSchema, db.query.ActionSchema);
  const ModuleService = new BaseService(ModuleSchema, db.query.ModuleSchema);

  const Y = await ActionService.findOne({
    name: action?.toUpperCase() as ActionSelect['name']
  });
  const X = await ModuleService.findOne({
    name: module?.toUpperCase()
  });

  req.action = toTitleCase(action ?? '');
  req.module = toTitleCase(module ?? '');

  return next();
};
