import { AxiosPromise } from 'axios';
import { createAuthAxiosInstance } from './client';
import { DetailedUser } from '@trg_package/dashboard-schemas/types';

const authAxios = createAuthAxiosInstance({
  baseURL: '/v1/auth',
  withCredentials: true
});

const services = {
  Authentication: {
    status: (): AxiosPromise<{
      user: DetailedUser | null;
      isAuthenticated: boolean;
    }> => {
      return authAxios.get(`/status`);
    },
    signOut: (): AxiosPromise<{ message: string }> => {
      return authAxios.post(`/sign-out`);
    }
  }
};

export default services;
