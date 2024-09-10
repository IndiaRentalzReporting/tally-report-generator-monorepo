import { AxiosPromise } from 'axios';
import { UserSelect } from '@trg_package/auth-schemas/types';
import createAxiosInstance from '@/services/client';

const authAxios = createAxiosInstance({
  baseURL: '/v1/auth',
  withCredentials: true
});

export const services = {
  forgotPassword: (data: {
    email: UserSelect['email'];
  }): AxiosPromise<{ message: string }> => {
    return authAxios.post('/forgot-password', data);
  },
  checkResetPassword: (token: string): AxiosPromise<{ token: string }> => {
    return authAxios.post(`/check-reset-password/${token}`);
  },
  resetPassword: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): AxiosPromise<{ message: string }> => {
    const { token, ...rest } = data;
    return authAxios.post(`/reset-password/${token}`, rest);
  }
};
