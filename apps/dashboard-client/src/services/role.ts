import { AxiosPromise } from 'axios';
import { RoleInsert, RoleSelect } from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

const rolesAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/roles',
    withCredentials: true
  }
);

export const services = {
  getAll: async (): AxiosPromise<{
    roles: RoleSelect[];
  }> => {
    return rolesAxios.get('/read');
  },
  getOne: async (id: RoleSelect['id']): AxiosPromise<{ role: RoleSelect }> => {
    return rolesAxios.get(`/read/${id}`);
  },
  createOne: async (data: {
    roleDetails: RoleInsert;
  }): AxiosPromise<{ role: RoleSelect }> => {
    return rolesAxios.post('/create', data);
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
