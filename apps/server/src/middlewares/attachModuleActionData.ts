import { NextFunction, Request, Response } from 'express';
import ModuleService from '../services/ModuleService';
import ActionService from '../services/ActionService';
import { ActionSelect } from '../models/schema';

declare global {
  namespace Express {
    interface Request {
      module_id?: string;
      action_id?: string;
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

  const { id: action_id } = await ActionService.findOne({
    name: action?.toUpperCase() as ActionSelect['name']
  });
  req.action_id = action_id;

  const { id: module_id } = await ModuleService.findOne({
    name: module?.toUpperCase()
  });
  req.module_id = module_id;

  next();
};
