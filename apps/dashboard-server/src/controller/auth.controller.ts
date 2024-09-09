import { NextFunction, Request, Response } from 'express';
import { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';
import { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import axios, { AxiosResponse } from 'axios';
import config from '../config';

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

export const handleStatusCheck = async (
  req: Request,
  res: Response<{
    user: Omit<DashDetailedUser, 'password'> | null;
    isAuthenticated: boolean;
  }>,
  next: NextFunction
) => {
  const { PROTOCOL, AUTH_SUBDOMAIN, DOMAIN, TLD } = config;
  try {
    const authResponse: AxiosResponse<{
      user: AuthDetailedUser & DashDetailedUser;
      isAuthenticated: boolean;
    }> = await axios.get(
      `${PROTOCOL}://${AUTH_SUBDOMAIN}.${DOMAIN}.${TLD}/api/v1/auth/status`,
      {
        withCredentials: true,
        headers: {
          cookie: req.headers.cookie
        }
      }
    );
    const { user, isAuthenticated } = authResponse.data;
    if (isAuthenticated && user) {
      const { password, ...userWithoutPassword } = user;
      return res.json({
        user: userWithoutPassword,
        isAuthenticated: true
      });
    } else {
      return res.json({
        user: null,
        isAuthenticated: false
      });
    }
  } catch (e) {
    return next(e);
  }
};
