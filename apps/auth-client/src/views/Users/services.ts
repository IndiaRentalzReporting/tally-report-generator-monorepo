import { AxiosPromise } from 'axios';
import { DetailedUser, RegisterUser, User } from '@/models';
import axios from '@/services/client';

export const services = {
  getAll: async (): AxiosPromise<{
    users: DetailedUser[];
  }> => {
    return axios.get('/users/read');
  },
  getOne: async (
    id: User['id'] | undefined
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return axios.get(`/users/read/${id}`);
  },
  createOne: (data: RegisterUser): AxiosPromise<Omit<User, 'password'>> => {
    return axios.post(`/auth/sign-up`, data);
  },
  updateOne: async (
    id: User['id'] | undefined,
    data: Partial<User>
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return axios.patch(`/users/update/${id}`, data);
  },
  deleteOne: async (
    id: User['id'] | undefined
  ): AxiosPromise<{
    user: DetailedUser;
  }> => {
    return axios.delete(`/users/delete/${id}`);
  }
};
