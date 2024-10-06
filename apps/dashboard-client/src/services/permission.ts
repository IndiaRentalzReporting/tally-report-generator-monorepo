import { AxiosPromise } from 'axios';
import {
  DetailedPermission,
  PermissionInsert,
  PermissionSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';

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
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return permissionsAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    permissionDetails: PermissionInsert
  ): AxiosPromise<{ permission: PermissionSelect }> =>
    permissionsAxios.post('/create', permissionDetails),
  updateOne: async (
    id: PermissionSelect['id'],
    data: Partial<PermissionSelect>
  ): AxiosPromise<{ permission: PermissionSelect }> =>
    permissionsAxios.patch(`/update/${id}`, data),
  deleteOne: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{ permission: PermissionSelect }> =>
    permissionsAxios.delete(`/delete/${id}`)
};
