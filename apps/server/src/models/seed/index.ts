import ActionService from '../../services/ActionService';
import AuthService from '../../services/AuthService';
import ModuleService from '../../services/ModuleService';
import RoleService from '../../services/RoleService';
import UserService from '../../services/UserService';
import { ActionSelect, RoleSelect } from '../schema';

const createActions = async () => {
  const actions = (
    ['CREATE', 'READ', 'UPDATE', 'DELETE'] as ActionSelect['name'][]
  ).map(async (name) => {
    await ActionService.createOne({ name });
  });

  await Promise.all(actions);
};

const createUsers = async (role: RoleSelect) => {
  const actions = [
    {
      first_name: 'Admin',
      last_name: 'Admin',
      email: 'admin@admin.com',
      password: 'administrator'
    },
    {
      first_name: 'Dev',
      last_name: 'Dev',
      email: 'dev@dev.com',
      password: 'developer'
    }
  ].map(async (user) => {
    const { id } = await AuthService.signUp(user);
    return id;
  });

  const users = await Promise.all(actions);

  await UserService.updateRole(users, role.id);
};

const createRoles = async () => {
  const name = 'superuser';
  return RoleService.createOne({ name });
};

const createModules = async () => {
  const modules = ['roles', 'users'].map((module) =>
    ModuleService.createOne({ name: module })
  );
  await Promise.all(modules);
};

const seed = async () => {
  await createActions();
  const roles = await createRoles();
  await createUsers(roles);
  await createModules();
  process.exit();
};

seed();
