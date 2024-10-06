import { AxiosPromise } from 'axios';
import {
  RoleInsert,
  RoleSelect,
  RoleWithPermission
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';

const rolesAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/roles',
    withCredentials: true
  }
);

export const services = {
  read: async (
    query: Partial<RoleSelect> = {}
  ): AxiosPromise<{
    roles: RoleWithPermission[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return rolesAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    roleDetails: RoleInsert
  ): AxiosPromise<{ role: RoleSelect }> =>
    rolesAxios.post('/create', roleDetails),
  updateOne: async (
    id: RoleSelect['id'],
    data: Partial<RoleSelect>
  ): AxiosPromise<RoleSelect> => rolesAxios.patch(`/update/${id}`, data),
  deleteOne: async (id: RoleSelect['id']): AxiosPromise<{ role: RoleSelect }> =>
    rolesAxios.delete(`/delete/${id}`)
};
