import axios, { AxiosPromise } from 'axios';
import { LoginUser, RegisterUser, User } from '@fullstack_package/interfaces';
import config from '@/config';

const services = {
  auth: {
    signin: (data: LoginUser): AxiosPromise<User> => {
      return axios.post(`${config.apiUrl()}/auth/login`, data);
    },
    signup: (data: RegisterUser): AxiosPromise<User> => {
      return axios.post(`${config.apiUrl()}/auth/register`, data);
    }
  }
};

export default services;
