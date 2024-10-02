import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import {
  LoginUser,
  SafeUserSelect,
  TenantInsert,
  TenantSelect,
  UserInsert,
  UserSelect
} from '@trg_package/schemas-auth/types';
import { BadRequestError, UnauthenticatedError } from '@trg_package/errors';
import DashboardService from '@/services/DashboardService';

export const onboard = async (
  req: Request<object, object, { tenant: TenantInsert; user: UserInsert }>,
  res: Response<{ tenant: TenantSelect; user: SafeUserSelect }>,
  next: NextFunction
) => {
  try {
    const { user, tenant } = await AuthService.onboard(req.body);
    res.json({ user, tenant });
  } catch (err) {
    return next(err);
  }
};

export const handleSignIn = async (
  req: Request<object, object, LoginUser>,
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

export const handleSignUp = async (
  req: Request<object, object, UserInsert>,
  res: Response<{
    user: UserSelect;
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const {
        tenant_id,
        tenant: { db_username, db_password, db_name }
      } = req.user;
      if (!db_username || !db_password || !db_name) {
        throw new BadRequestError('Invalid Tenant');
      }
      const DSI = new DashboardService(db_username, db_password, db_name);
      await DSI.createUser(req.body);
      const { user } = await AuthService.signUp({ ...req.body, tenant_id });
      return res.json({ user });
    }
    throw new UnauthenticatedError('Not logged in');
  } catch (err) {
    return next(err);
  }
};

export const handleSignOut = (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid', { path: '/' });
      res.clearCookie('permissions', { path: '/' });
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
      let { user } = req;
      if (user.role)
        user.role.permission = user.role.permission.filter(
          (permission) => !permission.module.isPrivate
        );
      return res.json({
        user,
        isAuthenticated: true
      });
    }
    res.clearCookie('connect.sid', { path: '/' });
    res.clearCookie('permissions', { path: '/' });
    return res.json({
      user: null,
      isAuthenticated: false
    });
  } catch (e) {
    return next(e);
  }
};
