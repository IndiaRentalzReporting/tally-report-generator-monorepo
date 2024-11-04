import {
  ApiKeyInsert,
  ApiKeySelect
} from '@trg_package/schemas-dashboard/types';
import createAxiosClient from '@trg_package/vite/client';
import { CrudServices } from '.';

const apiKeysAxios = createAxiosClient(
  { dashboard: true },
  {
    baseURL: '/v1/apiKeys',
    withCredentials: true
  }
);

export const services: CrudServices<
'apiKey',
ApiKeySelect,
ApiKeyInsert
> = {
  read: async (query) => {
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();
    return apiKeysAxios.get(`/read?${queryString}`);
  },
  createOne: async (data) => apiKeysAxios.post('/create', data),
  updateOne: async ({ id }, data) => apiKeysAxios.patch(`/update/${id}`, data),
  deleteOne: async ({ id }) => apiKeysAxios.delete(`/delete/${id}`)
};
