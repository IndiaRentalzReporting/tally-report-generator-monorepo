import ActionService from '../../services/ActionService';
import AuthService from '../../services/AuthService';
import RoleService from '../../services/RoleService';
import { ActionSelect } from '../schema';

const seedActions = async () => {
  const actions = (
    ['CREATE', 'READ', 'UPDATE', 'DELETE'] as ActionSelect['name'][]
  ).map(async (name) => ActionService.createOne({ name }));

  Promise.all(actions);
};

const seedUsers = async () => {
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
  ].map(async (user) => AuthService.signUp(user));

  Promise.all(actions);
};

seedActions();
seedUsers();
