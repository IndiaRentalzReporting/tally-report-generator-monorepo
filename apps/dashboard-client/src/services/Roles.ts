import {
  RoleInsert,
  RoleSelect,
  RoleWithPermission
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const rolesAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/roles',
    withCredentials: true
  }
);

export const services: CrudServices<
'role',
RoleSelect,
RoleInsert,
RoleWithPermission
> = {
  read: async (query = {}) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return rolesAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => rolesAxios.post('/create', data),
  updateOne: async ({ id }, data) => rolesAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => rolesAxios.delete(`/delete/${id}`)
};
