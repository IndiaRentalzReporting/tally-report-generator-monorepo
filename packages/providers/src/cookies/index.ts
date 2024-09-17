import Cookies from 'js-cookie';
import config from '../config';

const { VITE_TLD, VITE_DOMAIN, VITE_NODE_ENV, VITE_DASH_SUBDOMAIN } = config;

type CookieOptions = typeof Cookies.attributes;

const defaultCookieOptions: Omit<CookieOptions, 'domain'> = {
  path: '/',
  expires: 365,
  sameSite: 'lax' as const,
  secure: VITE_NODE_ENV === 'production' ? true : false
};

const setCookie = (
  name: string,
  value: string,
  options: Record<'dashboard', boolean>
) => {
  const domain = !!options.dashboard
    ? `${VITE_DASH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`
    : `.${VITE_DOMAIN}.${VITE_TLD}`;

  Cookies.set(name, value, {
    domain,
    ...defaultCookieOptions
  });
};

const getCookie = (name: string) => {
  return Cookies.get(name);
};

const removeCookie = (name: string, options: Record<'dashboard', boolean>) => {
  const domain = !!options.dashboard
    ? `${VITE_DASH_SUBDOMAIN}.${VITE_DOMAIN}.${VITE_TLD}`
    : `.${VITE_DOMAIN}.${VITE_TLD}`;

  Cookies.remove(name, {
    domain
  });
};

export { setCookie, getCookie, removeCookie };
