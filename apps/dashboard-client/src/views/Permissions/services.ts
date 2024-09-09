import { AxiosPromise } from 'axios';
import Module from 'module';
import {
  ActionSelect,
  DetailedPermission,
  PermissionSelect,
  RoleSelect
} from '@trg_package/dashboard-schemas/types';
import { createDashboardAxiosInstance } from '@/services/client';

const permissionsAxios = createDashboardAxiosInstance({
  baseURL: '/v1/permissions',
  withCredentials: true
});

export const services = {
  getAll: async (): AxiosPromise<{
    permissions: DetailedPermission[];
  }> => {
    return permissionsAxios.get('/read');
  },
  getAllOfRole: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{
    permissions: DetailedPermission[];
  }> => {
    return permissionsAxios.get(`/read/${id}`);
  },
  createMany: async (data: {
    role_id: RoleSelect['id'];
    permissions: {
      module_id: Module['id'];
      action_ids: ActionSelect['id'][];
    }[];
  }): AxiosPromise<{
    permissions: PermissionSelect[];
  }> => {
    return permissionsAxios.post('/create/many', {
      permissions: data.permissions,
      role_id: data.role_id
    });
  },
  updateMany: async (data: {
    role_id: RoleSelect['id'];
    permissions: {
      permission_id: PermissionSelect['id'];
      module_id: Module['id'];
      action_ids: ActionSelect['id'][];
    }[];
  }): AxiosPromise<{
    permissions: PermissionSelect[];
  }> => {
    return permissionsAxios.patch(`/update/many`, data);
  },
  deleteOne: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{
    permission: PermissionSelect;
  }> => {
    return permissionsAxios.delete(`/delete/${id}`);
  }
};
