import { AxiosPromise } from 'axios';
import {
  DetailedUser,
  UserInsert,
  UserSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';

const usersAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/users',
    withCredentials: true
  }
);

export const services = {
  read: async (
    query: Partial<UserSelect> = {}
  ): AxiosPromise<{
    users: DetailedUser[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return usersAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    data: UserInsert
  ): AxiosPromise<{
    user: UserSelect;
  }> => usersAxios.post('/create', data),
  updateOne: async (
    id: UserSelect['id'],
    data: Partial<UserSelect>
  ): AxiosPromise<{
    user: DetailedUser;
  }> => usersAxios.patch(`/update/${id}`, data),
  deleteOne: async (
    id: UserSelect['id']
  ): AxiosPromise<{
    user: DetailedUser;
  }> => usersAxios.delete(`/delete/${id}`)
};
