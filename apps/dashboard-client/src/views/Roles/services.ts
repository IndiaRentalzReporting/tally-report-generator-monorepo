import { AxiosPromise } from 'axios';
import Module from 'module';
import { createDashboardAxiosInstance } from '@/services/client';
import { services as permissionsServices } from '../Permissions/services';
import {
  RoleSelect,
  PermissionSelect,
  RoleWithPermission,
  ActionSelect
} from '@trg_package/schemas-dashboard/types';

const rolesAxios = createDashboardAxiosInstance({
  baseURL: '/v1/roles',
  withCredentials: true
});

export const services = {
  createOne: async (data: {
    role: Partial<RoleSelect>;
    permissions: {
      module_id: Module['id'];
      action_ids: ActionSelect['id'][];
    }[];
  }): AxiosPromise<{ permissions: PermissionSelect[] }> => {
    const { role } = (await rolesAxios.post(`/create`, data.role)).data;

    return permissionsServices.createMany({
      role_id: role.id,
      permissions: data.permissions
    });
  },
  createOneX: async (
    data: Partial<RoleSelect>
  ): AxiosPromise<{ permissions: PermissionSelect[] }> => {
    return rolesAxios.post(`/create`, data);
  },
  getAll: async (): AxiosPromise<{
    roles: RoleWithPermission[];
  }> => {
    return rolesAxios.get('/read');
  },
  getOne: async (
    id: RoleSelect['id']
  ): AxiosPromise<{
    role: RoleSelect;
  }> => {
    return rolesAxios.get(`/read/${id}`);
  },
  updateOneX: async (
    id: string,
    data: Partial<RoleSelect>
  ): AxiosPromise<{ permissions: PermissionSelect[] }> => {
    return rolesAxios.patch(`/update/${id}`, data);
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
      await rolesAxios.patch(`/update/${data.id}`, {
        name: data.role.name
      })
    ).data;

    return permissionsServices.updateMany({
      role_id: role.id,
      permissions: data.permissions
    });
  },
  deleteOne: async (
    id: RoleSelect['id']
  ): AxiosPromise<{
    role: RoleSelect;
  }> => {
    return rolesAxios.delete(`/delete/${id}`);
  }
};
