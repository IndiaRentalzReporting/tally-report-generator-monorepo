import { AxiosPromise } from 'axios';
import {
  RegisterUser,
  LoginUser,
  UserSelect,
  SafeUserSelect,
  TenantInsert,
  UserInsert
} from '@trg_package/auth-schemas/types';
import axios from '@/services/client';

export const services = {
  onboard: (data: {
    tenant: TenantInsert;
    user: UserInsert;
  }): AxiosPromise<{ user: SafeUserSelect }> => {
    return axios.post('/tenants/create', data);
  },
  signUp: (data: RegisterUser): AxiosPromise<SafeUserSelect> => {
    return axios.post(`/auth/sign-up`, data);
  },
  signIn: (data: LoginUser): AxiosPromise<{ user: SafeUserSelect }> => {
    return axios.post(`/auth/sign-in`, data);
  },
  forgotPassword: (data: {
    email: UserSelect['email'];
  }): AxiosPromise<{ message: string }> => {
    return axios.post('/auth/forgot-password', data);
  },
  checkResetPassword: (token: string): AxiosPromise<{ token: string }> => {
    return axios.post(`/auth/check-reset-password/${token}`);
  },
  resetPassword: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): AxiosPromise<{ message: string }> => {
    const { token, ...rest } = data;
    return axios.post(`/auth/reset-password/${token}`, rest);
  }
};
