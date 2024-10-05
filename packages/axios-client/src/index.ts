import Axios, { AxiosInstance } from 'axios';
import config from './config';
import { requestErrorHandler, responseErrorHandler } from './errorHandler';

const {
  PROTOCOL,
  VITE_AUTH_SUBDOMAIN,
  VITE_DASH_SUBDOMAIN,
  VITE_DOMAIN,
  VITE_TLD
} = config;

const createAxiosClient = (
  type: Record<'auth', true> | Record<'dashboard', true>,
  defaults: {
    baseURL: string;
    withCredentials: boolean;
  }
): AxiosInstance => {
  let subdomain;
  if ('auth' in type) {
    subdomain = VITE_AUTH_SUBDOMAIN;
  } else if ('dashboard' in type) {
    subdomain = VITE_DASH_SUBDOMAIN;
  }

  const axios = Axios.create({
    baseURL:
      `${PROTOCOL}://${subdomain}.${VITE_DOMAIN}.${VITE_TLD}/api${
        defaults.baseURL}`,
    withCredentials: defaults.withCredentials
  });

  axios.interceptors.request.use((config) => config, requestErrorHandler);
  axios.interceptors.response.use((response) => response, responseErrorHandler);

  return axios;
};

export default createAxiosClient;
