import { Express } from 'express';
import {
  attachModuleActionData,
  Initialization,
  isRoleAllowed
} from '../middlewares';
import {
  userMeRouter,
  roleRouter,
  userRouter,
  apiKeyRouter,
  reportRouter,
  actionRouter,
  moduleRouter,
  companyRouter,
  permissionRouter,
  permissionActionRouter,
  userTallyCompanyRouter
} from '../routes';

const routesLoader = (app: Express) => {
  Initialization.initialize();
  // app.use(Initialization.attachUser);
  app.use(Initialization.initDatabase);
  app.use(Initialization.initServices);
  app.use(Initialization.attachApiKeyUserId);

  app.use('/api/v1/users/me', userMeRouter);

  app.use(attachModuleActionData);
  app.use(isRoleAllowed);

  app.use('/api/v1/roles', roleRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/apiKeys', apiKeyRouter);
  app.use('/api/v1/reports', reportRouter);
  app.use('/api/v1/actions', actionRouter);
  app.use('/api/v1/modules', moduleRouter);
  app.use('/api/v1/companies', companyRouter);
  app.use('/api/v1/permissions', permissionRouter);
  app.use('/api/v1/permission_action', permissionActionRouter);
  app.use('/api/v1/user_tallyCompany', userTallyCompanyRouter);
};

export default routesLoader;
