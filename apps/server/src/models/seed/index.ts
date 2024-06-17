import ActionService from '../../services/ActionService';
import AuthService from '../../services/AuthService';
import RoleService from '../../services/RoleService';
import UserService from '../../services/UserService';
import { ActionSelect, RoleSelect } from '../schema';

const seedActions = async () => {
  const actions = (
    ['CREATE', 'READ', 'UPDATE', 'DELETE'] as ActionSelect['name'][]
  ).map(async (name) => ActionService.createOne({ name }));

  Promise.all(actions);
};

const seedUsers = async (role: RoleSelect) => {
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

  UserService.updateRole(users, role.id);
};

const seedRole = async () => {
  const name = 'superuser';
  return RoleService.createOne({ name });
};

seedActions();
seedRole().then(seedUsers);
