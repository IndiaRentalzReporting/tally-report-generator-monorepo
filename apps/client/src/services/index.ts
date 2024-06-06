import axios, { AxiosPromise } from 'axios';
import { LoginUser, RegisterUser, User } from '@fullstack_package/interfaces';
import config from '@/config';

const services = {
  auth: {
    signIn: (data: LoginUser): AxiosPromise<User> => {
      return axios.post(`${config.apiUrl()}/auth/sign-in`, data);
    },
    signUp: (data: RegisterUser): AxiosPromise<User> => {
      return axios.post(`${config.apiUrl()}/auth/sign-up`, data);
    }
  }
};

export default services;
