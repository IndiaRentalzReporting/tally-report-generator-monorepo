import { AxiosPromise } from 'axios';
import axios from './client';
import {
  Action,
  DetailedUser,
  LoginUser,
  Module,
  Permission,
  RegisterUser,
  Role,
  User
} from '@/models';

const services = {
  auth: {
    signIn: (data: LoginUser): AxiosPromise<Omit<User, 'password'>> => {
      return axios.post(`/auth/sign-in`, data);
    },
    signUp: (data: RegisterUser): AxiosPromise<Omit<User, 'password'>> => {
      return axios.post(`/auth/sign-up`, data);
    },
    status: (): AxiosPromise<{
      user: DetailedUser | null;
      isAuthenticated: boolean;
    }> => {
      return axios.get(`/auth/status`);
    },
    signOut: (): AxiosPromise<{ message: string }> => {
      return axios.post(`/auth/sign-out`);
    }
  },
  role: {
    getAll: async (): AxiosPromise<{
      roles: Role[];
    }> => {
      return axios.get('/roles/read');
    },
    createOne: async (data: {
      roleName: string;
      rolePermissions: {
        module_id: Module['id'];
        action_ids: Action['id'][];
      }[];
    }): AxiosPromise<{ permissions: Permission[] }> => {
      const { role } = (
        await axios.post(`/roles/create`, { name: data.roleName })
      ).data;

      return axios.post('/permissions/create/many', {
        permissions: data.rolePermissions,
        role_id: role.id
      });
    }
  },
  user: {
    getAll: async (): AxiosPromise<{
      users: DetailedUser[];
    }> => {
      return axios.get('/users/read');
    },
    assignRole: async (
      userIds: string[],
      roleId: string
    ): AxiosPromise<string[]> => {
      return axios.post('/users/update', { userIds, roleId });
    }
  },
  module: {
    getAll: async (): AxiosPromise<{
      modules: Module[];
    }> => {
      return axios.get('/modules/read');
    },
    createOne: async (data: Partial<Module>): AxiosPromise => {
      return axios.post('/modules/create', data);
    }
  },
  action: {
    getAll: async (): AxiosPromise<{
      actions: Action[];
    }> => {
      return axios.get('/actions/read');
    }
  }
};

export default services;
