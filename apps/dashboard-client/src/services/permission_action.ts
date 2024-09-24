import { AxiosPromise } from 'axios';
import {
  PermissionActionInsert,
  PermissionActionSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

const permissionActionsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/permission_actions',
    withCredentials: true
  }
);

export const services = {
  getAll: async (): AxiosPromise<{
    permissionActions: PermissionActionSelect[];
  }> => {
    return permissionActionsAxios.get('/read');
  },
  getOne: async ({
    action_id,
    permission_id
  }: {
    action_id: PermissionActionSelect['action_id'];
    permission_id: PermissionActionSelect['permission_id'];
  }): AxiosPromise<{ permissionAction: PermissionActionSelect }> => {
    return permissionActionsAxios.get(`/read/${action_id}/${permission_id}`);
  },
  createOne: async (data: {
    permissionActionDetails: PermissionActionInsert;
  }): AxiosPromise<{ permissionAction: PermissionActionSelect }> => {
    return permissionActionsAxios.post('/create', data);
  },
  updateOne: async (
    {
      action_id,
      permission_id
    }: {
      action_id: PermissionActionSelect['action_id'];
      permission_id: PermissionActionSelect['permission_id'];
    },
    data: Partial<PermissionActionSelect>
  ): AxiosPromise<PermissionActionSelect> => {
    return permissionActionsAxios.patch(
      `/update/${action_id}/${permission_id}`,
      data
    );
  },
  deleteOne: async ({
    action_id,
    permission_id
  }: {
    action_id: PermissionActionSelect['action_id'];
    permission_id: PermissionActionSelect['permission_id'];
  }): AxiosPromise<{ permissionAction: PermissionActionSelect }> => {
    return permissionActionsAxios.delete(
      `/delete/${action_id}/${permission_id}`
    );
  }
};
