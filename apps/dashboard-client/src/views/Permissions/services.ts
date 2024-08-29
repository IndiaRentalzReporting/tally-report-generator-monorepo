import { AxiosPromise } from 'axios';
import Module from 'module';
import {
  ActionSelect,
  DetailedPermission,
  PermissionSelect,
  RoleSelect
} from '../../../../../packages/schemas-dashboard/dist/types';
import axios from '@/services/client';

export const services = {
  getAll: async (): AxiosPromise<{
    permissions: DetailedPermission[];
  }> => {
    return axios.get('/permissions/read');
  },
  getAllOfRole: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{
    permissions: DetailedPermission[];
  }> => {
    return axios.get(`/permissions/read/${id}`);
  },
  createMany: async (data: {
    role_id: RoleSelect['id'];
    permissions: {
      module_id: Module['id'];
      action_ids: ActionSelect['id'][];
    }[];
  }): AxiosPromise<{
    permission: PermissionSelect;
  }> => {
    return axios.post('/permissions/create/many', {
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
    permission: PermissionSelect;
  }> => {
    return axios.patch(`/permissions/update/many`, data);
  },
  deleteOne: async (
    id: PermissionSelect['id']
  ): AxiosPromise<{
    permission: PermissionSelect;
  }> => {
    return axios.delete(`/permissions/delete/${id}`);
  }
};
