import { AxiosPromise } from 'axios';
import axios from './client';
import {
  Action,
  DetailedPermission,
  DetailedUser,
  LoginUser,
  Module,
  Permission,
  RegisterUser,
  Role,
  RoleWithPermission,
  User
} from '@/models';

const services = {
  Authentication: {
    signUp: (data: RegisterUser): AxiosPromise<Omit<User, 'password'>> => {
      return axios.post(`/auth/sign-up`, data);
    },
    signIn: (data: LoginUser): AxiosPromise<Omit<User, 'password'>> => {
      return axios.post(`/auth/sign-in`, data);
    },
    signOut: (): AxiosPromise<{ message: string }> => {
      return axios.post(`/auth/sign-out`);
    },
    status: (): AxiosPromise<{
      user: DetailedUser | null;
      isAuthenticated: boolean;
    }> => {
      return axios.get(`/auth/status`);
    }
  },
  Roles: {
    createOne: async (data: {
      role: Partial<Role>;
      permissions: {
        module_id: Module['id'];
        action_ids: Action['id'][];
      }[];
    }): AxiosPromise<{ permissions: Permission[] }> => {
      const { role } = (await axios.post(`/roles/create`, data.role)).data;

      return axios.post('/permissions/create/many', {
        permissions: data.permissions,
        role_id: role.id
      });
    },
    createOneX: async (
      data: Partial<Role>
    ): AxiosPromise<{ permissions: Permission[] }> => {
      return axios.post(`/roles/create`, data);
    },
    getAll: async (): AxiosPromise<{
      roles: RoleWithPermission[];
    }> => {
      return axios.get('/roles/read');
    },
    getOne: async (
      id: Role['id']
    ): AxiosPromise<{
      role: Role;
    }> => {
      return axios.get(`/roles/read/${id}`);
    },
    updateOneX: async (
      id: string,
      data: Partial<Role>
    ): AxiosPromise<{ permissions: Permission[] }> => {
      console.log({
        id,
        data
      });
      return axios.patch(`/roles/update/${id}`, data);
    },
    updateOne: async (data: {
      id: string;
      role: Partial<Role>;
      permissions: {
        permission_id: Permission['id'];
        module_id: Module['id'];
        action_ids: Action['id'][];
      }[];
    }): AxiosPromise<{ permissions: Permission[] }> => {
      const { role } = (
        await axios.patch(`/roles/update/${data.id}`, {
          name: data.role.name
        })
      ).data;

      return axios.post('/permissions/update/many', {
        permissions: data.permissions,
        role_id: role.id
      });
    },
    deleteOne: async (
      id: Role['id']
    ): AxiosPromise<{
      role: Role;
    }> => {
      return axios.delete(`/roles/delete/${id}`);
    }
  },
  Users: {
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
  },
  Modules: {
    getAll: async (): AxiosPromise<{
      modules: Module[];
    }> => {
      return axios.get('/modules/read');
    },
    getOne: async (
      id: Module['id'] | undefined
    ): AxiosPromise<{ module: Module }> => {
      return axios.get(`/modules/read/${id}`);
    },
    createOne: async (
      data: Partial<Module>
    ): AxiosPromise<{ module: Module }> => {
      return axios.post('/modules/create', data);
    },
    updateOne: async (
      id: Module['id'] | undefined,
      data: Partial<Module>
    ): AxiosPromise<Module> => {
      return axios.patch(`/modules/update/${id}`, data);
    },
    deleteOne: async (id: Module['id']): AxiosPromise<{ module: Module }> => {
      return axios.delete(`/modules/delete/${id}`);
    }
  },
  Actions: {
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
  },
  Permissions: {
    getAll: async (): AxiosPromise<{
      permissions: DetailedPermission[];
    }> => {
      return axios.get('/permissions/read');
    },
    getAllOfRole: async (
      id: Permission['id']
    ): AxiosPromise<{
      permissions: DetailedPermission[];
    }> => {
      return axios.get(`/permissions/read/${id}`);
    },
    createOne: async (data: {
      role_id: Role['id'];
      permissions: {
        module_id: Module['id'];
        action_ids: Action['id'][];
      }[];
    }): AxiosPromise<{
      permission: Permission;
    }> => {
      return axios.post('/permissions/create/many', {
        permissions: data.permissions,
        role_id: data.role_id
      });
    },

    updateOne: async (
      id: Permission['id'],
      data: Partial<Permission>
    ): AxiosPromise<{
      permission: Permission;
    }> => {
      return axios.patch(`/permissions/update/${id}`, data);
    },
    deleteOne: async (
      id: Permission['id']
    ): AxiosPromise<{
      permission: Permission;
    }> => {
      return axios.delete(`/permissions/delete/${id}`);
    }
  }
};

export default services;
