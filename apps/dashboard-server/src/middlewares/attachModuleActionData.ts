import { NextFunction, Request, Response } from 'express';
import { ActionSelect } from '@trg_package/dashboard-schemas/types';
import ModuleService from '../services/ModuleService';
import ActionService from '../services/ActionService';

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

  req.action = action?.toUpperCase();
  req.module = module?.toUpperCase();

  return next();
};
