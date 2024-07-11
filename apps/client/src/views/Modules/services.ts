import { AxiosPromise } from 'axios';
import { Module } from '@/models';
import axios from '@/services/client';

export const services = {
  getAll: async (): AxiosPromise<{
    modules: Module[];
  }> => {
    return axios.get('/modules/read');
  },
  getOne: async (
    id: Module['id'] | undefined
  ): AxiosPromise<{ module: Module }> => {
    return axios.get(`/modules/read/${id}`);
  },
  createOne: async (
    data: Partial<Module>
  ): AxiosPromise<{ module: Module }> => {
    return axios.post('/modules/create', data);
  },
  updateOne: async (
    id: Module['id'] | undefined,
    data: Partial<Module>
  ): AxiosPromise<Module> => {
    return axios.patch(`/modules/update/${id}`, data);
  },
  deleteOne: async (id: Module['id']): AxiosPromise<{ module: Module }> => {
    return axios.delete(`/modules/delete/${id}`);
  }
};
