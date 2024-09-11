import { NextFunction, Request, Response } from 'express';

export const attachModuleActionData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url } = req;
  const [module, action] = url.split('/').splice(-2);

  const Y = await req.actionService.findOne({
    name: action?.toUpperCase()
  });
  const X = await req.moduleService.findOne({
    name: module?.toUpperCase()
  });

  console.log({
    module,
    action,
    Y,
    X
  });

  req.action = action?.toUpperCase();
  req.module = module?.toUpperCase();

  return next();
};
