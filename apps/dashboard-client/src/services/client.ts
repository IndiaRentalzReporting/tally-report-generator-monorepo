import Axios, { AxiosError } from 'axios';

import { toast } from '@/lib/hooks';

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
      const errors = JSON.parse(error.response?.data.error) as Array<{
        code: string;
        expected: string;
        message: string;
        path: Array<string>;
        recieved: string;
      }>;

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

axios.defaults.baseURL = 'http://dashboard.trg.local/api/v1';
axios.defaults.withCredentials = true;

export default axios;
