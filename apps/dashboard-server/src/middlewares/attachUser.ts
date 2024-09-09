import config from '../config';
import axios, { AxiosResponse } from 'axios';
import { NextFunction, Response, Request } from 'express';
import { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';
import { UnauthenticatedError } from '@trg_package/errors';

export const attachUser = async (
  req: Request,
  res: Response,
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

    if (isAuthenticated && user.tenant_id) {
      req.user = user;
      next();
    } else {
      throw new UnauthenticatedError('User not found!');
    }
  } catch (e) {
    return next(e);
  }
};
