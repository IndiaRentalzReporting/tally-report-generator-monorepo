import { NextFunction, Request, Response } from 'express';

export const attachModuleActionData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path } = req;
  const pathParams = path.split('/');
  const module = pathParams[3];
  const action = pathParams[4];

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
