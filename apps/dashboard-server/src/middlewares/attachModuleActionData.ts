import { BadRequestError } from '@trg_package/errors';
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

  if (!module || !action) throw new BadRequestError('Invalid path');

  await req.services.action.findOne({
    name: action.toUpperCase()
  });
  await req.services.module.findOne({
    name: module.toUpperCase()
  });

  req.action = action.toUpperCase();
  req.module = module.toUpperCase();

  return next();
};
