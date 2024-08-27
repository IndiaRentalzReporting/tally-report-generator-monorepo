import { NextFunction, Request, Response } from 'express';

export const createOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (e) {
    console.error('Could not create api key', e);
    next(e);
  }
};
