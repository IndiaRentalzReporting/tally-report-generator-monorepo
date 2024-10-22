import { AxiosPromise } from 'axios';
import {
  DetailedColumnSelect,
  ReportInsert,
  ReportSelect,
  TableSelect
} from '@trg_package/schemas-reporting/types';
import createAxiosClient from '@trg_package/vite/client';

const reportsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/reports',
    withCredentials: true
  }
);

export const services = {
  read: async (
    query: Partial<ReportSelect> = {}
  ): AxiosPromise<{
    reports: ReportSelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return reportsAxios.get(`/read?${queryString}`);
  },
  createOne: async (
    data: ReportInsert
  ): AxiosPromise<{
    report: ReportSelect;
  }> => reportsAxios.post('/create', data),
  updateOne: async (
    id: ReportSelect['id'],
    data: Partial<ReportSelect>
  ): AxiosPromise<{
    report: ReportSelect;
  }> => reportsAxios.patch(`/update/${id}`, data),
  deleteOne: async (
    id: ReportSelect['id']
  ): AxiosPromise<{
    report: ReportSelect;
  }> => reportsAxios.delete(`/delete/${id}`),
  getColumns: async ({
    tableId,
    query = {}
  }: {
    tableId: TableSelect['id'];
    query?: Partial<DetailedColumnSelect>;
  }): AxiosPromise<{
    columns: DetailedColumnSelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return reportsAxios.get(`/read/getColumns/${tableId}?${queryString}`);
  },
  getTables: async (
    query: Partial<TableSelect> = {}
  ): AxiosPromise<{
    tables: TableSelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return reportsAxios.get(`/read/getTables?${queryString}`);
  }
};
