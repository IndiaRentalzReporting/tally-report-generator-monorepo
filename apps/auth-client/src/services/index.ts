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
  }): AxiosPromise<{ message: string }> => authAxios.post('/forgot-password', data),
  checkResetPassword: (token: string): AxiosPromise<{ token: string }> => authAxios.post(`/check-reset-password/${token}`),
  resetPassword: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): AxiosPromise<{ message: string }> => {
    const { token, ...rest } = data;
    return authAxios.post(`/reset-password/${token}`, rest);
  }
};
