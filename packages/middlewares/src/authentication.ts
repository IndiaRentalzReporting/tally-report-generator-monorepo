import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { BadRequestError, UnauthenticatedError } from '@trg_package/errors';

export const authenticate = passport.authenticate('local');

export const isUnauthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isUnauthenticated()) {
    return next();
  }
  throw new BadRequestError('You are already authenticated!');
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  throw new UnauthenticatedError('You are not authenticated!');
};
