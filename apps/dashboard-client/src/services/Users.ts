import {
  DetailedUser,
  UserInsert,
  UserSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const usersAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/users',
    withCredentials: true
  }
);

export const services: CrudServices<
'user',
UserSelect,
UserInsert,
DetailedUser
> = {
  read: async (query = {}) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return usersAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => usersAxios.post('/create', data),
  updateOne: async ({ id }, data) => usersAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => usersAxios.delete(`/delete/${id}`)
};
