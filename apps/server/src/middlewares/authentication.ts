import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import { eq } from 'drizzle-orm';
import { BadRequestError, UnauthenticatedError } from '../errors';
import { db } from '../models';
import { RoleSchema, UserSchema } from '../models/schema';

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
    const userWithRole = await db.query.UserSchema.findFirst({
      where: eq(UserSchema.id, req.user.id),
      with: {
        userToRole: {
          columns: {
            role_id: true
          }
        }
      }
    });
    userWithRole?.userToRole.forEach(async ({ role_id }) => {
      const role = await db.query.RoleSchema.findFirst({
        where: eq(RoleSchema.id, role_id)
      });
      if (role?.name === 'admin') {
        return next();
      }
    });
    throw new UnauthenticatedError('You are not an Admin!');
  } else {
    throw new UnauthenticatedError('You are not an Admin!');
  }
};
