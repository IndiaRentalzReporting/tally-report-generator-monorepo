import { AxiosPromise } from 'axios';
import { RegisterUser, LoginUser, User } from '@/models';
import axios from '@/services/client';

export const services = {
  signUp: (data: RegisterUser): AxiosPromise<Omit<User, 'password'>> => {
    return axios.post(`/auth/sign-up`, data);
  },
  signIn: (
    data: LoginUser
  ): AxiosPromise<{
    user: Omit<User, 'password'>;
    resetPasswordLink?: string;
  }> => {
    return axios.post(`/auth/sign-in`, data);
  },
  signOut: (): AxiosPromise<{ message: string }> => {
    return axios.post(`/auth/sign-out`);
  },
  forgot_password: (data: {
    email: User['email'];
  }): AxiosPromise<{ message: string }> => {
    return axios.post('/auth/forgot-password', data);
  },
  check_reset_password: (token: string): AxiosPromise<{ token: string }> => {
    return axios.post(`/auth/check-reset-password/${token}`);
  },
  reset_password: (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }): AxiosPromise<{ message: string }> => {
    const { token, ...rest } = data;
    return axios.post(`/auth/reset-password/${token}`, rest);
  }
};
