import { AxiosPromise } from 'axios';
import createAxiosInstance from './client';
import {
  LoginUser,
  SafeUserSelect,
  TenantInsert,
  UserInsert,
  UserSelect
} from '@trg_package/auth-schemas/types';

const authAxios = createAxiosInstance({
  baseURL: '/v1/auth',
  withCredentials: true
});

const services = {
  status: (): AxiosPromise<{
    user: SafeUserSelect | null;
    isAuthenticated: boolean;
  }> => {
    return authAxios.get(`/status`);
  },
  signOut: (): AxiosPromise<{ message: string }> => {
    return authAxios.post(`/sign-out`);
  },
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

export default services;
