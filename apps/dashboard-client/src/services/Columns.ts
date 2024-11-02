import {
  ColumnInsert,
  ColumnSelect,
  DetailedColumnSelect,
  GeneratedReportFilters,
  ReportSelect
} from '@trg_package/schemas-reporting/types';
import createAxiosClient from '@trg_package/vite/client';
import { AxiosPromise } from 'axios';
import { CrudServices } from '.';

const columnsAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/reports',
    withCredentials: true
  }
);

export const services: CrudServices<
'column',
ColumnSelect,
ColumnInsert,
DetailedColumnSelect
> = {
  read: async (query) => {
    if (!query) throw new Error('Query is required');
    const { tableId } = query;
    return columnsAxios.get(`/read/columns/${tableId}`);
  },
  createOne: async (data) => columnsAxios.post('/create', data),
  updateOne: async ({ id }, data) => columnsAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => columnsAxios.delete(`/delete/${id}`),
};

export const getColumnData = async (columnId: string): AxiosPromise<Array<{
  label: string;
  value: string;
}>> => columnsAxios.get(`/read/selectData/${columnId}`);

export const getReportColumn = async (reportId: string): AxiosPromise<
Array<Pick<NonNullable<ReportSelect['queryConfig']
>, 'columns'>>> => columnsAxios.get(`/read/reportColumns/${reportId}`);

export const getReportData = async (reportId: string): AxiosPromise<{
  data: unknown[]
}> => columnsAxios.get(`/read/reportData/${reportId}`);

export const getReportFilter = async (reportId: string): AxiosPromise<{
  filters : GeneratedReportFilters[]
}> => columnsAxios.get(`/read/reportFilters/${reportId}`);
