import { type AxiosPromise } from 'axios';
import {
  TenantInsert,
  TenantSelect,
  UserSelect,
  UserTenantSelect
} from '@trg_package/schemas-auth/types';
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
  onboard: (data: {
    tenant: TenantInsert;
    user: RegisterUser;
  }): AxiosPromise => authAxios.post('/onboard', data),
  signIn: (data: LoginUser): AxiosPromise<{ user: DetailedUser, firstLoginResetToken?: string }> => authAxios.post('/sign/in', data),
  signUp: (data: Omit<RegisterUser, 'password'>): AxiosPromise<{ user: UserSelect }> => authAxios.post('/sign/up', data),
  switchTeam: (data: Pick<UserTenantSelect, 'tenant_id'>): AxiosPromise => authAxios.post('/teams/switch', data),
  createTeam: (data: Pick<TenantSelect, 'name'>): AxiosPromise => authAxios.post('/teams/create', data),
  signOut: (): AxiosPromise => authAxios.post('/sign/out'),
  resetPassword: (token: string, data: {
    password: string;
    confirmPassword: string;
  }): AxiosPromise => authAxios.post('/password/reset', data, { params: { token } })
};

export default services;
