import { AxiosPromise } from 'axios';
import { ModuleSelect } from '../../../../../packages/schemas-dashboard/dist/types';
import axios from '@/services/client';
import { IColumnDetails } from './TableCreation';

export const services = {
  getAll: async (): AxiosPromise<{
    modules: ModuleSelect[];
  }> => {
    return axios.get('/modules/read');
  },
  getOne: async (
    id: ModuleSelect['id'] | undefined
  ): AxiosPromise<{ module: ModuleSelect }> => {
    return axios.get(`/modules/read/${id}`);
  },
  createOne: async (data: {
    moduleDetails: Partial<ModuleSelect>;
    columnDetails: Array<IColumnDetails>;
  }): AxiosPromise<{ module: ModuleSelect }> => {
    return axios.post('/modules/create', data);
  },
  updateOne: async (
    id: ModuleSelect['id'] | undefined,
    data: Partial<ModuleSelect>
  ): AxiosPromise<ModuleSelect> => {
    return axios.patch(`/modules/update/${id}`, data);
  },
  deleteOne: async (
    id: ModuleSelect['id']
  ): AxiosPromise<{ module: ModuleSelect }> => {
    return axios.delete(`/modules/delete/${id}`);
  }
};
