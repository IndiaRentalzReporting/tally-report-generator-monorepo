import { AxiosPromise } from 'axios';
import {
  RoleInsert,
  RoleSelect,
  RoleWithPermission
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

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
    const queryString = new URLSearchParams(query as any).toString();
    return rolesAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    roleDetails: RoleInsert
  ): AxiosPromise<{ role: RoleSelect }> => {
    return rolesAxios.post('/create', roleDetails);
  },
  updateOne: async (
    id: RoleSelect['id'],
    data: Partial<RoleSelect>
  ): AxiosPromise<RoleSelect> => {
    return rolesAxios.patch(`/update/${id}`, data);
  },
  deleteOne: async (
    id: RoleSelect['id']
  ): AxiosPromise<{ role: RoleSelect }> => {
    return rolesAxios.delete(`/delete/${id}`);
  }
};
