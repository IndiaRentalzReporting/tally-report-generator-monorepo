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

  await req.dashboard.services.action.findOne({
    name: action?.toUpperCase()
  });
  await req.dashboard.services.module.findOne({
    name: module?.toUpperCase()
  });

  req.action = action?.toUpperCase();
  req.module = module?.toUpperCase();

  return next();
};
