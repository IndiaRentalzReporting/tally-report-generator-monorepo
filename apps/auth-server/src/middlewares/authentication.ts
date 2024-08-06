import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { BadRequestError, UnauthenticatedError } from '../errors';
import UserService from '../services/UserService';
import config from '../config';
import { DetailedUser } from '../models/schema';

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
  throw new BadRequestError('You are not authenticated!');
};

export const isRoleAllowed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    const {
      user: { role },
      module,
      action
    } = req;

    if (!role) {
      throw new UnauthenticatedError(
        'You are not allowed to do anything, please get a role assigned to yourself'
      );
    }

    if (module && action) {
      const { permission } = role;

      const allowed = permission.find(
        ({ permissionAction, module: { name: moduleName } }) =>
          permissionAction.find(
            ({ action: { name: actionName } }) => actionName === action
          ) && moduleName === module
      );

      console.log(allowed);

      if (allowed) return next();
      throw new UnauthenticatedError(
        'You are not allowed to perform this action'
      );
    } else {
      throw new BadRequestError('Invalid url, no module or action found!');
    }
  }
  throw new UnauthenticatedError('You are not authenticated');
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    const {
      user: { email }
    } = req;
    const user = (await UserService.findOneDetailedUser({
      email
    })) as DetailedUser;
    if (user?.role?.name.toLowerCase() === config.app.SUPER_USER_NAME) {
      return next();
    }
    throw new UnauthenticatedError('You are not an Admin!');
  }
  throw new UnauthenticatedError('You are not an logged in!');
};
