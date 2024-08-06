import { AxiosPromise } from 'axios';
import Module from 'module';
import { Action, DetailedPermission, Permission, Role } from '@/models';
import axios from '@/services/client';

export const services = {
  getAll: async (): AxiosPromise<{
    permissions: DetailedPermission[];
  }> => {
    return axios.get('/permissions/read');
  },
  getAllOfRole: async (
    id: Permission['id']
  ): AxiosPromise<{
    permissions: DetailedPermission[];
  }> => {
    return axios.get(`/permissions/read/${id}`);
  },
  createMany: async (data: {
    role_id: Role['id'];
    permissions: {
      module_id: Module['id'];
      action_ids: Action['id'][];
    }[];
  }): AxiosPromise<{
    permission: Permission;
  }> => {
    return axios.post('/permissions/create/many', {
      permissions: data.permissions,
      role_id: data.role_id
    });
  },
  updateMany: async (data: {
    role_id: Role['id'];
    permissions: {
      permission_id: Permission['id'];
      module_id: Module['id'];
      action_ids: Action['id'][];
    }[];
  }): AxiosPromise<{
    permission: Permission;
  }> => {
    return axios.patch(`/permissions/update/many`, data);
  },
  deleteOne: async (
    id: Permission['id']
  ): AxiosPromise<{
    permission: Permission;
  }> => {
    return axios.delete(`/permissions/delete/${id}`);
  }
};
