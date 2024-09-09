import { Express } from 'express';
import authRouter from '../routes/auth.route';
import roleRouter from '../routes/role.route';
import userRouter from '../routes/user.route';
import moduleRouter from '../routes/module.route';
import actionRouter from '../routes/action.route';
import permissionRouter from '../routes/permission.route';
import {
  attachModuleActionData,
  attachPGDashboard,
  attachServices,
  attachUser,
  isRoleAllowed
} from '../middlewares';

const routesLoader = (app: Express) => {
  app.use('/api/v1/auth', authRouter);
  app.use(attachUser);
  app.use(attachPGDashboard);
  app.use(attachServices);
  app.use(attachModuleActionData);
  app.use(isRoleAllowed);
  app.use('/api/v1/roles', roleRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/modules', moduleRouter);
  app.use('/api/v1/actions', actionRouter);
  app.use('/api/v1/permissions', permissionRouter);
};

export default routesLoader;
