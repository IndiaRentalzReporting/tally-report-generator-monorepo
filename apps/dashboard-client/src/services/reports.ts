import { AxiosPromise } from 'axios';
import {
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
  }> => reportsAxios.delete(`/delete/${id}`)
};

const columnsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/columns',
    withCredentials: true
  }
);

const columnServices = {
  read: async (
    tableId: TableSelect['id'],
    query: Partial<ReportSelect> = {}
  ): AxiosPromise<{
    reports: ReportSelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return columnsAxios.get(`/read/${tableId}?${queryString}`);
  }
};

const tablesAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/tables',
    withCredentials: true
  }
);

export const tableServices = {
  read: async (
    query: Partial<ReportSelect> = {}
  ): AxiosPromise<{
    reports: ReportSelect[];
  }> => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return tablesAxios.get(`/read?${queryString}`);
  }
};
