import config from '../../config';
import ActionService from '../../services/ActionService';
import AuthService from '../../services/AuthService';
import RoleService from '../../services/RoleService';

const createActions = async () => {
  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'SYNC'].map(async (name) => {
    await ActionService.createOne({ name, isReadonly: true });
  });
  await Promise.all(actions);
};

const createDefaultModules = async () => {
  const modules = ['ROLES', 'USERS'].map((module) => {
    ModuleService.createOne({ name: module })
  }
  );
  await Promise.all(modules);
};

const createRoles = async () => {
  const name = config.super_user.role;
  const isReadonly = true;
  return RoleService.createOne({ name, isReadonly });
};

const seed = async () => {
  const {
    first_name,
    last_name,
    email,
    password
  } = config.super_user;

  if (!first_name || !last_name || !email || !password)
    throw Error('Invalid user credentials');

  const role = await createRoles();
  const user = await AuthService.signUp({
    first_name,
    last_name,
    email,
    password,
    role_id: role.id
  });
  await createActions();
  // await createModules();
  process.exit();
};

seed();
