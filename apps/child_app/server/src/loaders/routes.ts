import { Express } from 'express';
import authRouter from '../routes/auth.route';
import roleRouter from '../routes/role.route';
import userRouter from '../routes/user.route';
import moduleRouter from '../routes/module.route';
import actionRouter from '../routes/action.route';
import permissionRouter from '../routes/permission.route';
import {
  attachModuleActionData,
  isAuthenticated,
  isRoleAllowed
} from '../middlewares';

const routesLoader = (app: Express) => {
  app.use('/auth', authRouter);
  app.use(isAuthenticated);
  app.use(attachModuleActionData);
  app.use(isRoleAllowed);
  app.use('/roles', roleRouter);
  app.use('/users', userRouter);
  app.use('/modules', moduleRouter);
  app.use('/actions', actionRouter);
  app.use('/permissions', permissionRouter);
};

export default routesLoader;
