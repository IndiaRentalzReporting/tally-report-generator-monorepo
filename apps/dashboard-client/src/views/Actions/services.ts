import { AxiosPromise } from 'axios';
import { ActionSelect } from '@trg_package/schemas-dashboard/types';
import { createDashboardAxiosInstance } from '@/services/client';

const actionsAxios = createDashboardAxiosInstance({
  baseURL: '/v1/actions',
  withCredentials: true
});

export const services = {
  getAll: async (): AxiosPromise<{
    actions: ActionSelect[];
  }> => {
    return actionsAxios.get('/read');
  },
  getOne: async (
    id: ActionSelect['id']
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return actionsAxios.get(`/read/${id}`);
  },
  createOne: async (
    data: Partial<ActionSelect>
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return actionsAxios.post(`/create/`, data);
  },
  updateOne: async (
    id: ActionSelect['id'],
    data: Partial<ActionSelect>
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return actionsAxios.patch(`/update/${id}`, data);
  },
  deleteOne: async (
    id: ActionSelect['id']
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return actionsAxios.delete(`/delete/${id}`);
  }
};
