import ActionService from '../../services/ActionService';
import AuthService from '../../services/AuthService';
import RoleService from '../../services/RoleService';
import UserService from '../../services/UserService';
import { ActionSelect, RoleSelect } from '../schema';

const createActions = async () => {
  const actions = (
    ['CREATE', 'READ', 'UPDATE', 'DELETE'] as ActionSelect['name'][]
  ).map(async (name) => ActionService.createOne({ name }));

  Promise.all(actions);
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

const seed = async () => {
  await createActions();
  const roles = await createRoles();
  await createUsers(roles);
  process.exit();
};

seed();
