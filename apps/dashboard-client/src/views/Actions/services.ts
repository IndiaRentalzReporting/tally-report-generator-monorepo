import { AxiosPromise } from 'axios';
import { Action } from '@/models';
import axios from '@/services/client';

export const services = {
  getAll: async (): AxiosPromise<{
    actions: Action[];
  }> => {
    return axios.get('/actions/read');
  },
  getOne: async (
    id: Action['id']
  ): AxiosPromise<{
    action: Action;
  }> => {
    return axios.get(`/actions/read/${id}`);
  },
  createOne: async (
    data: Partial<Action>
  ): AxiosPromise<{
    action: Action;
  }> => {
    return axios.post(`/actions/create/`, data);
  },
  updateOne: async (
    id: Action['id'],
    data: Partial<Action>
  ): AxiosPromise<{
    action: Action;
  }> => {
    return axios.patch(`/actions/update/${id}`, data);
  },
  deleteOne: async (
    id: Action['id']
  ): AxiosPromise<{
    action: Action;
  }> => {
    return axios.delete(`/actions/delete/${id}`);
  }
};
