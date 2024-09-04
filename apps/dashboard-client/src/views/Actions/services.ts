import { AxiosPromise } from 'axios';
import { ActionSelect } from '@trg_package/dashboard-schemas/types';
import axios from '@/services/client';

export const services = {
  getAll: async (): AxiosPromise<{
    actions: ActionSelect[];
  }> => {
    return axios.get('/actions/read');
  },
  getOne: async (
    id: ActionSelect['id']
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return axios.get(`/actions/read/${id}`);
  },
  createOne: async (
    data: Partial<ActionSelect>
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return axios.post(`/actions/create/`, data);
  },
  updateOne: async (
    id: ActionSelect['id'],
    data: Partial<ActionSelect>
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return axios.patch(`/actions/update/${id}`, data);
  },
  deleteOne: async (
    id: ActionSelect['id']
  ): AxiosPromise<{
    action: ActionSelect;
  }> => {
    return axios.delete(`/actions/delete/${id}`);
  }
};
