import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { BadRequestError, UnauthenticatedError } from '../errors';

export const authenticate = passport.authenticate('local');

export const isUnauthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isUnauthenticated()) {
    next();
  } else {
    throw new BadRequestError('You are already authenticated!');
  }
};

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw new UnauthenticatedError('You are not authenticated!');
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.isAuthenticated() /** && Some condition to check if the user is admin */
  ) {
    next();
  } else {
    throw new UnauthenticatedError('You are not authenticated!');
  }
};
