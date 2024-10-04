import { AxiosPromise } from 'axios';
import {
  ActionInsert,
  ActionSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

const actionsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/actions',
    withCredentials: true
  }
);

export const services = {
  read: async (
    query: Partial<ActionSelect> = {}
  ): AxiosPromise<{
    actions: ActionSelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return actionsAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    data: ActionInsert
  ): AxiosPromise<{
    action: ActionSelect;
  }> => actionsAxios.post('/create', data),
  updateOne: async (
    id: ActionSelect['id'],
    data: Partial<ActionSelect>
  ): AxiosPromise<{
    action: ActionSelect;
  }> => actionsAxios.patch(`/update/${id}`, data),
  deleteOne: async (
    id: ActionSelect['id']
  ): AxiosPromise<{
    action: ActionSelect;
  }> => actionsAxios.delete(`/delete/${id}`)
};
