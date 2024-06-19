import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { BadRequestError, UnauthenticatedError } from '../errors';
import UserService from '../services/UserService';
import PermissionService from '../services/PermissionService';
import PermissionActionService from '../services/PermissionActionService';
import config from '../config';

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
    throw new BadRequestError('You are not authenticated!');
  }
};

export const isRoleAllowed = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      const {
        user: { role_id },
        module_id,
        action_id
      } = req;

      if (!role_id) {
        throw new UnauthenticatedError(
          'You are not allowed to do anything, please get a role assigned to yourself'
        );
      }

      if (module_id && action_id) {
        const { id: permission_id } = await PermissionService.findOne({
          module_id,
          role_id
        });

        const permissionAction = await PermissionActionService.findOne({
          permission_id,
          action_id
        });

        if (permissionAction) next();
      } else {
        throw new BadRequestError('Invalid url, no module or action found!');
      }
    }
    throw new UnauthenticatedError('You are not logged in!');
  };
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
    const user = await UserService.findOne({ email });
    if (user?.role?.name.toLowerCase() === config.app.SUPER_USER_NAME) {
      return next();
    }
    throw new UnauthenticatedError('You are not an Admin!');
  }
  throw new UnauthenticatedError('You are not an logged in!');
};
