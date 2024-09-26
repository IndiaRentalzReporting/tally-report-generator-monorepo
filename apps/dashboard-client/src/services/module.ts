import { AxiosPromise } from 'axios';
import {
  ModuleInsert,
  ModuleSelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/axios-client';

const modulesAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/modules',
    withCredentials: true
  }
);

export const services = {
  read: async (
    query: Partial<ModuleSelect> = {}
  ): AxiosPromise<{
    modules: ModuleSelect[];
  }> => {
    const queryString = new URLSearchParams(query as any).toString();
    return modulesAxios.get(`/read?${queryString}`);
  },
  createOne: async (data: {
    moduleDetails: ModuleInsert;
  }): AxiosPromise<{ module: ModuleSelect }> => {
    return modulesAxios.post('/create', data);
  },
  updateOne: async (
    id: ModuleSelect['id'],
    data: Partial<ModuleSelect>
  ): AxiosPromise<ModuleSelect> => {
    return modulesAxios.patch(`/update/${id}`, data);
  },
  deleteOne: async (
    id: ModuleSelect['id']
  ): AxiosPromise<{ module: ModuleSelect }> => {
    return modulesAxios.delete(`/delete/${id}`);
  }
};