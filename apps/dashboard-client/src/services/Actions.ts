import {
  ActionInsert,
  ActionSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const actionsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/actions',
    withCredentials: true
  }
);

export const services: CrudServices<
'action',
ActionSelect,
ActionInsert
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return actionsAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => actionsAxios.post('/create', data),
  updateOne: async ({ id }, data) => actionsAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => actionsAxios.delete(`/delete/${id}`)
};
