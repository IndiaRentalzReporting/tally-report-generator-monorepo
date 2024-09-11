import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import {
  SafeUserSelect,
  TenantInsert,
  TenantSelect,
  UserInsert
} from '@trg_package/schemas-auth/types';
import { UnauthenticatedError } from '@trg_package/errors';

export const handleSignUp = async (
  req: Request<object, object, { tenant: TenantInsert; user: UserInsert }>,
  res: Response<{ tenant: TenantSelect; user: SafeUserSelect }>,
  next: NextFunction
) => {
  try {
    const { user, tenant } = await AuthService.signUp(req.body);
    res.json({ user, tenant });
  } catch (err) {
    return next(err);
  }
};

export const handleSignIn = async (
  req: Request<object, object, UserInsert>,
  res: Response<{
    user: Request['user'];
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { user } = req;
      return res.json({ user });
    }
    throw new UnauthenticatedError('Not logged in');
  } catch (err) {
    return next(err);
  }
};

export const handleLogout = (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid', { path: '/' }); // 'connect.sid' is the default session cookie name
      return res.json({ message: 'Logged Out' });
    });
  });
};

export const handleStatusCheck = (
  req: Request,
  res: Response<{
    user: Request['user'] | null;
    isAuthenticated: boolean;
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { user } = req;
      return res.json({
        user,
        isAuthenticated: true
      });
    }
    return res.json({
      user: null,
      isAuthenticated: false
    });
  } catch (e) {
    return next(e);
  }
};
