import { AxiosPromise } from 'axios';
import { DetailedUser, UserSelect } from '@trg_package/dashboard-schemas/types';
import { RegisterUser } from '@trg_package/auth-schemas/types';
import axios from '@/services/client';

export const services = {
  getAll: async (): AxiosPromise<{
    users: DetailedUser[];
  }> => {
    return axios.get('/users/read');
  },
  getOne: async (
    id: UserSelect['id'] | undefined
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return axios.get(`/users/read/${id}`);
  },
  createOne: (
    data: RegisterUser
  ): AxiosPromise<Omit<UserSelect, 'password'>> => {
    return axios.post(`/auth/sign-up`, data);
  },
  updateOne: async (
    id: UserSelect['id'] | undefined,
    data: Partial<UserSelect>
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return axios.patch(`/users/update/${id}`, data);
  },
  deleteOne: async (
    id: UserSelect['id'] | undefined
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return axios.delete(`/users/delete/${id}`);
  }
};
