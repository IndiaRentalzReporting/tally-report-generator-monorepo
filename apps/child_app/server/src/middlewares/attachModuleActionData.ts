import { NextFunction, Request, Response } from 'express';
import ModuleService from '../services/ModuleService';
import ActionService from '../services/ActionService';
import { ActionSelect } from '../models/schema';
import { toTitleCase } from '../utils';

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
