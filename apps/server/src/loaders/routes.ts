import { Express } from 'express';
import authRouter from '../routes/auth.route';
import roleRouter from '../routes/role.route';
import userRouter from '../routes/user.route';
import moduleRouter from '../routes/module.route';
import actionRouter from '../routes/action.route';
import permissionRouter from '../routes/permission.route';
import { isAdmin, attachModuleActionData } from '../middlewares';

const routesLoader = (app: Express) => {
  app.use('/auth', authRouter);
  // app.use(attachModuleActionData);
  app.use('/role', isAdmin, roleRouter);
  app.use('/user', isAdmin, userRouter);
  app.use('/module', isAdmin, moduleRouter);
  app.use('/action', isAdmin, actionRouter);
  app.use('/permission', isAdmin, permissionRouter);
};

export default routesLoader;
