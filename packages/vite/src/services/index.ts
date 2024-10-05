import { type AxiosPromise } from 'axios';
import {
  LoginUser,
  RegisterUser,
  TenantInsert,
  UserInsert,
  UserSelect
} from '@trg_package/schemas-auth/types';
import createAxiosClient from '../client';
import { DetailedUser } from '../models';

const authAxios = createAxiosClient(
  { auth: true },
  {
    baseURL: '/v1/auth',
    withCredentials: true
  }
);

const services = {
  status: (): AxiosPromise<{
    user: DetailedUser | null;
    isAuthenticated: boolean;
  }> => authAxios.get('/status'),
  signOut: (): AxiosPromise<{ message: string }> => authAxios.post('/sign-out'),
  onboard: (data: {
    tenant: TenantInsert;
    user: UserInsert;
  }): AxiosPromise<{ user: DetailedUser }> => authAxios.post('/onboard', data),
  signUp: (data: RegisterUser): AxiosPromise<{ user: UserSelect }> =>
    authAxios.post('/sign-up', data),
  signIn: (data: LoginUser): AxiosPromise<{ user: DetailedUser }> =>
    authAxios.post('/sign-in', data),
  forgotPassword: (data: {
    email: UserSelect['email'];
  }): AxiosPromise<{ message: string }> =>
    authAxios.post('/forgot-password', data),
  checkResetPassword: (token: string): AxiosPromise<{ token: string }> =>
    authAxios.post(`/check-reset-password/${token}`),
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
