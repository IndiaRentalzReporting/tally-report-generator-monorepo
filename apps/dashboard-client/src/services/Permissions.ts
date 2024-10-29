import {
  DetailedPermission,
  PermissionInsert,
  PermissionSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const permissionsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/permissions',
    withCredentials: true
  }
);

export const services: CrudServices<
'permission',
PermissionSelect,
PermissionInsert,
DetailedPermission
> = {
  read: async (query = {}) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return permissionsAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => permissionsAxios.post('/create', data),
  updateOne: async ({ id }, data) => permissionsAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => permissionsAxios.delete(`/delete/${id}`)
};
