import {
  ColumnInsert,
  ColumnSelect,
  DetailedColumnSelect
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

export const getColumnData = async (columnId: string): AxiosPromise<{ data: Array<{
  label: string;
  value: string;
}> }> => columnsAxios.get(`/read/selectData/${columnId}`);
