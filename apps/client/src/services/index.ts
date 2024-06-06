import axios, { AxiosPromise } from 'axios';
import { LoginUser, RegisterUser, User } from '@fullstack_package/interfaces';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

const services = {
  auth: {
    signIn: (data: LoginUser): AxiosPromise<User> => {
      return axios.post(`/auth/sign-in`, data);
    },
    signUp: (data: RegisterUser): AxiosPromise<User> => {
      return axios.post(`/auth/sign-up`, data);
    },
    status: (): AxiosPromise<{
      user: User | null;
      isAuthenticated: boolean;
    }> => {
      return axios.get(`/auth/status`);
    },
    signOut: (): AxiosPromise<{ message: string }> => {
      return axios.post(`/auth/sign-out`);
    }
  }
};

export default services;
