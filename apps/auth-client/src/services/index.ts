import { AxiosPromise } from 'axios';
import createAxiosInstance from './client';
import { SafeUserSelect } from '@trg_package/auth-schemas/types';

const authAxios = createAxiosInstance({
  baseURL: '/v1/auth',
  withCredentials: true
});

const services = {
  Authentication: {
    status: (): AxiosPromise<{
      user: SafeUserSelect | null;
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
