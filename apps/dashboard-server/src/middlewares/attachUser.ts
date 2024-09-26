import { NextFunction, Response, Request } from 'express';
import { DetailedUser as AuthDetailedUser } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/schemas-dashboard/types';
import { UnauthenticatedError } from '@trg_package/errors';
import { authAxios } from '@/utils/authAxios';
import { AxiosResponse } from 'axios';

const cache = new Map<
  string,
  { user: AuthDetailedUser & DashDetailedUser; expires: number }
>();
const CACHE_TTL = 60 * 60 * 1000;

export const attachUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.headers.cookie;

    if (!cookie) throw new UnauthenticatedError('No cookie found');

    const cachedUser = cache.get(cookie);
    if (cachedUser && cachedUser.expires > Date.now()) {
      req.user = cachedUser.user;
      return next();
    }

    const authResponse: AxiosResponse<{
      user: AuthDetailedUser & DashDetailedUser;
      isAuthenticated: boolean;
    }> = await authAxios.get('/api/v1/auth/status');

    const { user, isAuthenticated } = authResponse.data;

    if (isAuthenticated && user.tenant_id) {
      cache.set(cookie, {
        user,
        expires: req.session.cookie.expires
          ? req.session.cookie.expires.getTime()
          : Date.now() + CACHE_TTL // Default TTL if no cookie expiry
      });
      req.user = user;
      return next();
    } else {
      req.user = undefined;
      throw new UnauthenticatedError('User not found!');
    }
  } catch (e) {
    req.user = undefined;
    return next(e);
  }
};

setInterval(() => {
  const now = Date.now();
  for (let [key, value] of cache.entries()) {
    if (value.expires <= now) {
      cache.delete(key);
    }
  }
}, CACHE_TTL);
