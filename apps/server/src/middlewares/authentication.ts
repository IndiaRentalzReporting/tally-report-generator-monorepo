import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { BadRequestError, UnauthenticatedError } from '../errors';
import UserService from '../services/UserService';

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

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    const user = await UserService.findOne({ email: req.user.email });
    if (user?.role?.name.toLowerCase() === 'admin') {
      return next();
    }
  }
  throw new UnauthenticatedError('You are not an Admin!');
};
