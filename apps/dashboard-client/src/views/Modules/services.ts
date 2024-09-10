import { AxiosPromise } from 'axios';
import { ModuleSelect } from '@trg_package/dashboard-schemas/types';
import { createDashboardAxiosInstance } from '@/services/client';
import { IColumnDetails } from './TableCreation';

const modulesAxios = createDashboardAxiosInstance({
  baseURL: '/v1/modules',
  withCredentials: true
});

export const services = {
  getAll: async (): AxiosPromise<{
    modules: ModuleSelect[];
  }> => {
    return modulesAxios.get('/read');
  },
  getOne: async (
    id: ModuleSelect['id']
  ): AxiosPromise<{ module: ModuleSelect }> => {
    return modulesAxios.get(`/read/${id}`);
  },
  createOne: async (data: {
    moduleDetails: Partial<ModuleSelect>;
    columnDetails: Array<IColumnDetails>;
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
