import { type AxiosPromise } from 'axios';
import {
  TenantInsert,
  TenantSelect,
  UserSelect
} from '@trg_package/schemas-auth/types';
import { SafeUserSelect } from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '../client';
import { DetailedUser, LoginUser, RegisterUser } from '../models';

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
  signOut: (): AxiosPromise => authAxios.post('/sign-out'),
  onboard: (data: {
    tenant: TenantInsert;
    user: RegisterUser;
  }): AxiosPromise<{ tenant: TenantSelect; user: SafeUserSelect }> => authAxios.post('/onboard', data),
  signUp: (data: Omit<RegisterUser, 'password'>): AxiosPromise<{ user: UserSelect }> => authAxios.post('/sign-up', data),
  signIn: (data: LoginUser): AxiosPromise<{ user: DetailedUser, redirect?: string }> => authAxios.post('/sign-in', data),
};

export default services;
