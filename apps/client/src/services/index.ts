import { AxiosPromise } from 'axios';
import axios from './client';
import { DetailedUser } from '@/models';

const services = {
  status: (): AxiosPromise<{
    user: DetailedUser | null;
    isAuthenticated: boolean;
  }> => {
    return axios.get(`/auth/status`);
  }
};

export default services;
