import Axios, { AxiosError, AxiosPromise } from 'axios';
import {
  CreatePermissions,
  LoginUser,
  RegisterUser,
  User
} from '@fullstack_package/interfaces';
import { showErrorAlert } from '@/lib/utils';

const axios = Axios.create();

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (e: AxiosError<any>) => {
    // add logger
    return Promise.reject(e);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (e: AxiosError<any>) => {
    // add logger
    let errorMapped: Array<{ message: string }> = [];
    let errors: Array<string> = [];
    try {
      errorMapped = JSON.parse(e.response?.data?.error || '') as Array<{
        message: string;
      }>;
      errors = errorMapped.map((er) => er.message);
    } catch (_) {
      errors.push(e.response?.data.error || `Couldn't sign you in!`);
    }
    errors.forEach((e) => showErrorAlert(e));
    return Promise.reject(errors);
  }
);

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
  },
  role: {
    getAll: async (): AxiosPromise => {
      return axios.get('/role/all');
    },
    createOne: async (data: {
      roleName: string;
      rolePermissions: CreatePermissions;
    }): AxiosPromise => {
      const { role } = (
        await axios.post(`/role/create`, { name: data.roleName })
      ).data;
      return axios.post('/role/assignPermission', {
        permissions: data.rolePermissions,
        roleId: role.id
      });
    }
  },
  user: {
    getAll: async (): AxiosPromise<{
      users: (User & { roles: string[] })[];
    }> => {
      return axios.get('/user/all', {});
    },
    assignRole: async (
      userIds: string[],
      roleId: string
    ): AxiosPromise<string[]> => {
      return axios.post('/user/assignRole', { userIds, roleId });
    }
  },
  module: {
    getAll: async (): AxiosPromise<
      {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
      }[]
    > => {
      return axios.get('/module/all');
    }
  },
  action: {
    getAll: async (): AxiosPromise<{
      actions: {
        id: string;
        name: string;
        createdAt: Date;
        updateAt: Date;
      }[];
    }> => {
      return axios.get('/action/all');
    }
  }
};

export default services;
