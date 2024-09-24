import { AxiosPromise } from 'axios';
import {
  PermissionInsert,
  PermissionSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

const permissionsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/permissions',
    withCredentials: true
  }
);

export const services = {
  getAll: async (): AxiosPromise<{
    permissions: PermissionSelect[];
  }> => {
    return permissionsAxios.get('/read');
  },
  getOne: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{ permission: PermissionSelect }> => {
    return permissionsAxios.get(`/read/${id}`);
  },
  createOne: async (data: {
    permissionDetails: PermissionInsert;
  }): AxiosPromise<{ permission: PermissionSelect }> => {
    return permissionsAxios.post('/create', data);
  },
  updateOne: async (
    id: PermissionSelect['id'],
    data: Partial<PermissionSelect>
  ): AxiosPromise<PermissionSelect> => {
    return permissionsAxios.patch(`/update/${id}`, data);
  },
  deleteOne: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{ permission: PermissionSelect }> => {
    return permissionsAxios.delete(`/delete/${id}`);
  }
};
