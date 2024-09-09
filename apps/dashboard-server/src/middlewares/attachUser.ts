import config from '../config';
import axios, { AxiosResponse } from 'axios';
import { NextFunction, Response, Request } from 'express';
import { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';
import { UnauthenticatedError } from '@trg_package/errors';

const { PROTOCOL, AUTH_SUBDOMAIN, DOMAIN, TLD } = config;

const authAxios = axios.create({
  baseURL: `${PROTOCOL}://${AUTH_SUBDOMAIN}.${DOMAIN}.${TLD}`,
  withCredentials: true
});

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
      req.attacheDBandServices = false;
      return next();
    }

    const authResponse: AxiosResponse<{
      user: AuthDetailedUser & DashDetailedUser;
      isAuthenticated: boolean;
    }> = await authAxios.get('/api/v1/auth/status', {
      headers: { cookie }
    });

    const { user, isAuthenticated } = authResponse.data;

    if (isAuthenticated && user.tenant_id) {
      cache.set(cookie, {
        user,
        expires: req.session.cookie.expires
          ? req.session.cookie.expires.getTime()
          : Date.now() + CACHE_TTL // Default TTL if no cookie expiry
      });
      req.user = user;
      req.attacheDBandServices = true;
      return next();
    } else {
      req.user = undefined;
      throw new UnauthenticatedError('User not found!');
    }
  } catch (e) {
    req.user = undefined;
    req.attacheDBandServices = true;
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
