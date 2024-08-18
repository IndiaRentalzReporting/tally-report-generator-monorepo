import { AxiosPromise } from 'axios';
import Module from 'module';
import axios from '@/services/client';
import {
  RoleSelect,
  PermissionSelect,
  RoleWithPermission,
  ActionSelect
} from '@trg_package/dashboard-schemas/types';

export const services = {
  createOne: async (data: {
    role: Partial<RoleSelect>;
    permissions: {
      module_id: Module['id'];
      action_ids: ActionSelect['id'][];
    }[];
  }): AxiosPromise<{ permissions: PermissionSelect[] }> => {
    const { role } = (await axios.post(`/roles/create`, data.role)).data;

    return axios.post('/permissions/create/many', {
      permissions: data.permissions,
      role_id: role.id
    });
  },
  createOneX: async (
    data: Partial<RoleSelect>
  ): AxiosPromise<{ permissions: PermissionSelect[] }> => {
    return axios.post(`/roles/create`, data);
  },
  getAll: async (): AxiosPromise<{
    roles: RoleWithPermission[];
  }> => {
    return axios.get('/roles/read');
  },
  getOne: async (
    id: RoleSelect['id']
  ): AxiosPromise<{
    role: RoleSelect;
  }> => {
    return axios.get(`/roles/read/${id}`);
  },
  updateOneX: async (
    id: string,
    data: Partial<RoleSelect>
  ): AxiosPromise<{ permissions: PermissionSelect[] }> => {
    return axios.patch(`/roles/update/${id}`, data);
  },
  updateOne: async (data: {
    id: string;
    role: Partial<RoleSelect>;
    permissions: {
      permission_id: PermissionSelect['id'];
      module_id: Module['id'];
      action_ids: ActionSelect['id'][];
    }[];
  }): AxiosPromise<{ permissions: PermissionSelect[] }> => {
    const { role } = (
      await axios.patch(`/roles/update/${data.id}`, {
        name: data.role.name
      })
    ).data;

    return axios.post('/permissions/update/many', {
      permissions: data.permissions,
      role_id: role.id
    });
  },
  deleteOne: async (
    id: RoleSelect['id']
  ): AxiosPromise<{
    role: RoleSelect;
  }> => {
    return axios.delete(`/roles/delete/${id}`);
  }
};
