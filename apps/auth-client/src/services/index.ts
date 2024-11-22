import { AxiosPromise } from 'axios';
import { UserSelect } from '@trg_package/schemas-auth/types';
import createAxiosClient from '@trg_package/vite/client';

const authAxios = createAxiosClient(
  { auth: true },
  {
    baseURL: '/v1/auth',
    withCredentials: true
  }
);

export const services = {
  forgotPassword: (data: {
    email: UserSelect['email'];
  }): AxiosPromise<{ message: string }> => authAxios.post('/password/forgot', data),
  resetPassword: (token: string, data: {
    password: string;
    confirmPassword: string;
  }): AxiosPromise<{ message: string }> => authAxios.post(`/password/reset/${token}`, data)
};
