import { NextFunction, Request, Response } from 'express';
import {
  LoginUser,
  TenantInsert,
  TenantSelect,
  RegisterUser,
} from '@trg_package/schemas-auth/types';
import { BadRequestError, UnauthenticatedError } from '@trg_package/errors';
import { SafeUserSelect as DashboardSafeUserSelect } from '@trg_package/schemas-dashboard/types';
import DashboardService from '@/services/DashboardService';
import AuthService from '../services/AuthService';

export const onboard = async (
  req: Request<object, object, { tenant: TenantInsert; user: RegisterUser }>,
  res: Response<{ tenant: TenantSelect; user: DashboardSafeUserSelect }>,
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
  req: Request<object, object, RegisterUser>,
  res: Response<{
    user: DashboardSafeUserSelect;
  }>,
  next: NextFunction
) => {
  try {
    if (!req.user) throw new UnauthenticatedError('Not logged in');

    const {
      tenant_id,
      tenant: { db_username, db_password, db_name }
    } = req.user;

    if (!db_username || !db_password || !db_name) {
      throw new BadRequestError('Invalid Tenant');
    }

    const DSI = new DashboardService(db_username, db_password, db_name);
    const { password, ...user } = await DSI.createUser(req.body);

    await AuthService.signUp({
      ...req.body,
      tenant_id,
      password
    });

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
};

export const handleSignOut = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logOut((err) => {
    if (err) return next(err);
    return req.session.destroy((err) => {
      if (err) return next(err);
      return res
        .clearCookie('connect.sid', { path: '/' })
        .status(200)
        .send();
    });
  });
};

export const handlePublicStatusCheck = (
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
    return res
      .clearCookie('connect.sid', { path: '/' })
      .clearCookie('permissions', { path: '/' })
      .json({
        user: null,
        isAuthenticated: false
      });
  } catch (e) {
    return next(e);
  }
};

export const handlePrivateStatusCheck = (
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
      return res.originalJson({
        user,
        isAuthenticated: true
      });
    }
    return res
      .clearCookie('connect.sid', { path: '/' })
      .clearCookie('permissions', { path: '/' })
      .json({
        user: null,
        isAuthenticated: false
      });
  } catch (e) {
    return next(e);
  }
};
