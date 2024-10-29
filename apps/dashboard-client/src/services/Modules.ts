import {
  ModuleInsert,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const modulesAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/modules',
    withCredentials: true
  }
);

export const services: CrudServices<
'module',
ModuleSelect,
ModuleInsert
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return modulesAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => modulesAxios.post('/create', data),
  updateOne: async ({ id }, data) => modulesAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => modulesAxios.delete(`/delete/${id}`)
};
