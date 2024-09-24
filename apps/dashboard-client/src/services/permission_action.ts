import { AxiosPromise } from 'axios';
import {
  PermissionActionInsert,
  PermissionActionSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

const permissionActionAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/permissionAction',
    withCredentials: true
  }
);

export const services = {
  getAll: async (): AxiosPromise<{
    permissionAction: PermissionActionSelect[];
  }> => {
    return permissionActionAxios.get('/read');
  },
  getOne: async ({
    action_id,
    permission_id
  }: {
    action_id: PermissionActionSelect['action_id'];
    permission_id: PermissionActionSelect['permission_id'];
  }): AxiosPromise<{
    permissionAction: PermissionActionSelect[];
  }> => {
    return permissionActionAxios.get(`/read/${action_id}/${permission_id}`);
  },
  createOne: async (data: {
    action_id: PermissionActionInsert['action_id'];
    permission_id: PermissionActionInsert['permission_id'];
  }): AxiosPromise<{
    permission: PermissionActionSelect;
  }> => {
    return permissionActionAxios.post('/create', data);
  },
  deleteOne: async ({
    action_id,
    permission_id
  }: {
    action_id: PermissionActionSelect['action_id'];
    permission_id: PermissionActionSelect['permission_id'];
  }): AxiosPromise<{
    permission: PermissionActionSelect;
  }> => {
    return permissionActionAxios.delete(
      `/delete/${action_id}/${permission_id}`
    );
  }
};
