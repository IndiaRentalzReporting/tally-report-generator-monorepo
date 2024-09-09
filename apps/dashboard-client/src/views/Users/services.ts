import { AxiosPromise } from 'axios';
import { DetailedUser, UserSelect } from '@trg_package/dashboard-schemas/types';
import { RegisterUser } from '@trg_package/auth-schemas/types';
import { createDashboardAxiosInstance } from '@/services/client';

const usersAxios = createDashboardAxiosInstance({
  baseURL: '/v1/users',
  withCredentials: true
});

export const services = {
  getAll: async (): AxiosPromise<{
    users: DetailedUser[];
  }> => {
    return usersAxios.get('/read');
  },
  getOne: async (
    id: UserSelect['id']
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return usersAxios.get(`/read/${id}`);
  },
  createOne: (
    data: RegisterUser
  ): AxiosPromise<Omit<UserSelect, 'password'>> => {
    return usersAxios.post(`/sign-up`, data);
  },
  updateOne: async (
    id: UserSelect['id'],
    data: Partial<UserSelect>
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return usersAxios.patch(`/update/${id}`, data);
  },
  deleteOne: async (
    id: UserSelect['id']
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return usersAxios.delete(`/delete/${id}`);
  }
};
