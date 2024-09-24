import { AxiosPromise } from 'axios';
import {
  DetailedPermission,
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
  read: async (
    query: Partial<PermissionSelect> = {}
  ): AxiosPromise<{
    permissions: DetailedPermission[];
  }> => {
    const queryString = new URLSearchParams(query as any).toString();
    return permissionsAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    permissionDetails: PermissionInsert
  ): AxiosPromise<{ permission: PermissionSelect }> => {
    return await permissionsAxios.post('/create', permissionDetails);
  },
  updateOne: async (
    id: PermissionSelect['id'],
    data: Partial<PermissionSelect>
  ): AxiosPromise<{ permission: PermissionSelect }> => {
    return permissionsAxios.patch(`/update/${id}`, data);
  },
  deleteOne: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{ permission: PermissionSelect }> => {
    return permissionsAxios.delete(`/delete/${id}`);
  }
};
