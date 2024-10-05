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
  read: async (
    query: Partial<PermissionActionSelect> = {}
  ): AxiosPromise<{
    permissionActions: PermissionActionSelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return permissionActionsAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    permissionActionDetails: PermissionActionInsert
  ): AxiosPromise<{ permissionAction: PermissionActionSelect }> => permissionActionsAxios.post('/create', permissionActionDetails),
  updateOne: async (
    {
      action_id,
      permission_id
    }: {
      action_id: PermissionActionSelect['action_id'];
      permission_id: PermissionActionSelect['permission_id'];
    },
    data: Partial<PermissionActionSelect>
  ): AxiosPromise<PermissionActionSelect> => permissionActionsAxios.patch(`/update/${action_id}/${permission_id}`, data),
  deleteOne: async ({
    action_id,
    permission_id
  }: {
    action_id: PermissionActionSelect['action_id'];
    permission_id: PermissionActionSelect['permission_id'];
  }): AxiosPromise<{ permissionAction: PermissionActionSelect }> => permissionActionsAxios.delete(`/delete/${action_id}/${permission_id}`)
};
