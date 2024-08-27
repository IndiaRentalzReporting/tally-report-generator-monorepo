import { NextFunction, Request, Response } from 'express';
import { ActionSelect } from '@trg_package/dashboard-schemas/types';

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

  const Y = await req.actionService.findOne({
    name: action?.toUpperCase()
  });
  const X = await req.moduleService.findOne({
    name: module?.toUpperCase()
  });

  req.action = action?.toUpperCase();
  req.module = module?.toUpperCase();

  return next();
};
