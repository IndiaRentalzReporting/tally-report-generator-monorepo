import { AxiosPromise } from 'axios';
import {
  LoginUser,
  UserSelect,
  SafeUserSelect,
  TenantInsert,
  UserInsert
} from '@trg_package/auth-schemas/types';
import createAxiosInstance from '@/services/client';

const authAxios = createAxiosInstance({
  baseURL: '/v1/auth',
  withCredentials: true
});

export const services = {
  signUp: (data: {
    tenant: TenantInsert;
    user: UserInsert;
  }): AxiosPromise<{ user: SafeUserSelect }> => {
    return authAxios.post('/sign-up', data);
  },
  signIn: (data: LoginUser): AxiosPromise<{ user: SafeUserSelect }> => {
    return authAxios.post(`/sign-in`, data);
  },
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
