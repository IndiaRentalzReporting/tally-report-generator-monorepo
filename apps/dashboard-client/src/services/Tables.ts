import {
  TableInsert,
  TableSelect
} from '@trg_package/schemas-reporting/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const tablesAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/reports',
    withCredentials: true
  }
);

export const services: CrudServices<
'table',
TableSelect,
TableInsert
> = {
  read: async () => tablesAxios.get('/read/tables'),
  createOne: async (data) => tablesAxios.post('/create', data),
  updateOne: async ({ id }, data) => tablesAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => tablesAxios.delete(`/delete/${id}`)
};
