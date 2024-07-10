import { AxiosPromise } from 'axios';
import Module from 'module';
import axios from '@/services/client';
import { Role, Permission, RoleWithPermission, Action } from '@/models';

export const services = {
  createOne: async (data: {
    role: Partial<Role>;
    permissions: {
      module_id: Module['id'];
      action_ids: Action['id'][];
    }[];
  }): AxiosPromise<{ permissions: Permission[] }> => {
    const { role } = (await axios.post(`/roles/create`, data.role)).data;

    return axios.post('/permissions/create/many', {
      permissions: data.permissions,
      role_id: role.id
    });
  },
  createOneX: async (
    data: Partial<Role>
  ): AxiosPromise<{ permissions: Permission[] }> => {
    return axios.post(`/roles/create`, data);
  },
  getAll: async (): AxiosPromise<{
    roles: RoleWithPermission[];
  }> => {
    return axios.get('/roles/read');
  },
  getOne: async (
    id: Role['id']
  ): AxiosPromise<{
    role: Role;
  }> => {
    return axios.get(`/roles/read/${id}`);
  },
  updateOneX: async (
    id: string,
    data: Partial<Role>
  ): AxiosPromise<{ permissions: Permission[] }> => {
    return axios.patch(`/roles/update/${id}`, data);
  },
  updateOne: async (data: {
    id: string;
    role: Partial<Role>;
    permissions: {
      permission_id: Permission['id'];
      module_id: Module['id'];
      action_ids: Action['id'][];
    }[];
  }): AxiosPromise<{ permissions: Permission[] }> => {
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
    id: Role['id']
  ): AxiosPromise<{
    role: Role;
  }> => {
    return axios.delete(`/roles/delete/${id}`);
  }
};
