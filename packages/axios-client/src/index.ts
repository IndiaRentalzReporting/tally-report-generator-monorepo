import Axios, { AxiosError, AxiosInstance } from 'axios';
import { toast } from '@trg_package/components';
import config from './config';
import z from 'zod';

const axios = Axios.create();
axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (e: AxiosError<any>) => {
    // add logger
    return Promise.reject(e);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    // add logger
    if (error.response?.status === 422) {
      const errors = JSON.parse(
        error.response?.data.error
      ) as Array<z.ZodIssue>;

      errors.forEach((error) =>
        toast({
          variant: 'destructive',
          title: `Type Error in ${error.path}`,
          description: error.message
        })
      );
    } else {
      toast({
        variant: 'destructive',
        title: error.message,
        description: error.response?.data.error.toUpperCase()
      });
    }
    return Promise.reject(error);
  }
);

const createAxiosClient = (
  type: Record<'auth', true> | Record<'dashboard', true>,
  defaults: {
    baseURL: string;
    withCredentials: boolean;
  }
): AxiosInstance => {
  const {
    PROTOCOL,
    VITE_AUTH_SUBDOMAIN,
    VITE_DASH_SUBDOMAIN,
    VITE_DOMAIN,
    VITE_TLD
  } = config;

  let subdomain;

  if ('auth' in type) {
    subdomain = VITE_AUTH_SUBDOMAIN;
  } else if ('dashboard' in type) {
    subdomain = VITE_DASH_SUBDOMAIN;
  }

  axios.defaults.baseURL =
    `${PROTOCOL}://${subdomain}.${VITE_DOMAIN}.${VITE_TLD}/api` +
    defaults.baseURL;
  axios.defaults.withCredentials = defaults.withCredentials;

  return axios;
};

export default createAxiosClient;
