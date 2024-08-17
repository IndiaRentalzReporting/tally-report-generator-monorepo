import { PGColumnDataTypeValue } from '@trg_package/pg-orm';
import config from '../../config';
import AuthService from '../../services/AuthService';
import UserService from '../../services/UserService';
import { ModuleInsert } from '../schema';
import DatabaseService from '../../services/DatabaseService';
import PermissionService from '../../services/PermissionService';
import ModuleService from '../../services/ModuleService';
import ActionService from '../../services/ActionService';
import RoleService from '../../services/RoleService';

const createActions = async () => {
  const actions = ['CREATE', 'READ', 'UPDATE', 'DELETE'].map(async (name) => {
    await ActionService.createOne({ name });
  });

  await Promise.all(actions);
};

const createModules = async () => {
  const modules: Array<{
    moduleDetails: ModuleInsert;
    columnDetails: Array<{
      name: ModuleInsert['name'];
      type: PGColumnDataTypeValue;
    }>;
  }> = [
    {
      moduleDetails: { name: 'ROLES' },
      columnDetails: [
        { name: 'id', type: 'UUID' },
        { name: 'name', type: 'VARCHAR(50)' },
        { name: 'createdAt', type: 'TIMESTAMP(3)' },
        { name: 'updatedAt', type: 'TIMESTAMP(3)' }
      ]
    },
    {
      moduleDetails: { name: 'USERS' },
      columnDetails: [
        { name: 'id', type: 'UUID' },
        { name: 'role_id', type: 'UUID' },
        { name: 'first_name', type: 'VARCHAR(50)' },
        { name: 'last_name', type: 'VARCHAR(50)' },
        { name: 'email', type: 'VARCHAR(256)' },
        { name: 'password', type: 'VARCHAR(128)' },
        { name: 'createdAt', type: 'TIMESTAMP(3)' },
        { name: 'updatedAt', type: 'TIMESTAMP(3)' }
      ]
    },
    {
      moduleDetails: { name: 'MODULES' },
      columnDetails: [
        { name: 'id', type: 'UUID' },
        { name: 'name', type: 'VARCHAR(50)' },
        { name: 'icon', type: 'TEXT' },
        { name: 'isPrivate', type: 'TEXT' },
        { name: 'createdAt', type: 'TIMESTAMP(3)' },
        { name: 'updatedAt', type: 'TIMESTAMP(3)' }
      ]
    }
  ];
  modules.map(async ({ moduleDetails, columnDetails }) => {
    const createdModule = await ModuleService.createOne(moduleDetails);
    try {
      await DatabaseService.createNewTable(createdModule.name, columnDetails);
    } catch (e) {
      await ModuleService.deleteOne(createdModule.id);
    }

    await PermissionService.extendSuperuserModules(createdModule.id);
  });
  await Promise.all(modules);
};

const createRoles = async () => {
  const { SUPER_USER_NAME: name } = config;
  return RoleService.createOne({ name });
};

const seed = async () => {
  const {
    DEVELOPER_FIRST_NAME: first_name,
    DEVELOPER_LAST_NAME: last_name,
    DEVELOPER_EMAIL: email,
    DEVELOPER_PASSWORD: password
  } = config;

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
