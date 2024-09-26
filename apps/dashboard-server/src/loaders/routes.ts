import { Express } from 'express';
import roleRouter from '@/routes/role.route';
import userRouter from '@/routes/user.route';
import moduleRouter from '@/routes/module.route';
import actionRouter from '@/routes/action.route';
import permissionRouter from '@/routes/permission.route';
import permissionActionRouter from '@/routes/permission_action.route';
import apiKeyRouter from '@/routes/apiKey.route';
import companyRouter from '@/routes/company.route';
import userTallyCompanyRouter from '@/routes/user_tallyCompany.route';
import {
  attachModuleActionData,
  attachPGDashboard,
  attachServices,
  attachUser,
  isRoleAllowed
} from '@/middlewares';

const routesLoader = (app: Express) => {
  app.use('/api/v1/companies', companyRouter);

  app.use(attachUser);
  app.use(attachPGDashboard);
  app.use(attachServices);
  app.use(attachModuleActionData);
  app.use(isRoleAllowed);

  app.use('/api/v1/roles', roleRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/apiKeys', apiKeyRouter);
  app.use('/api/v1/actions', actionRouter);
  app.use('/api/v1/modules', moduleRouter);
  app.use('/api/v1/permissions', permissionRouter);
  app.use('/api/v1/permission_action', permissionActionRouter);
  app.use('/api/v1/user_tallyCompany', userTallyCompanyRouter);
};

export default routesLoader;
