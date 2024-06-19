import config from '../../config';
import ActionService from '../../services/ActionService';
import AuthService from '../../services/AuthService';
import ModuleService from '../../services/ModuleService';
import RoleService from '../../services/RoleService';
import UserService from '../../services/UserService';

const createActions = async () => {
  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE'].map(async (name) => {
    await ActionService.createOne({ name });
  });

  await Promise.all(actions);
};

const createModules = async () => {
  const modules = ['ROLES', 'USERS'].map((module) =>
    ModuleService.createOne({ name: module })
  );
  await Promise.all(modules);
};

const createRoles = async () => {
  const name = config.app.SUPER_USER_NAME;
  return RoleService.createOne({ name });
};

const seed = async () => {
  const {
    DEVELOPER_FIRST_NAME: first_name,
    DEVELOPER_LAST_NAME: last_name,
    DEVELOPER_EMAIL: email,
    DEVELOPER_PASSWORD: password
  } = config.app;

  if (!first_name || !last_name || !email || !password)
    throw Error('Invalid user credentials');

  const user = await AuthService.signUp({
    first_name,
    last_name,
    email,
    password
  });
  const role = await createRoles();
  await UserService.updateRole([user.id], role.id);
  await createActions();
  await createModules();
  process.exit();
};

seed();
