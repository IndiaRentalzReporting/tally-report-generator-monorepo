import {
  ReportInsert,
  ReportSelect
} from '@trg_package/schemas-reporting/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const reportsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/reports',
    withCredentials: true
  }
);

export const services: CrudServices<
'report',
ReportSelect,
ReportInsert
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return reportsAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => reportsAxios.post('/create', data),
  updateOne: async ({ id }, data) => reportsAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => reportsAxios.delete(`/delete/${id}`),
};
