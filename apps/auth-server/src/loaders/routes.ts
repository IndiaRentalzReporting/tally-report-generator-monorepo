import { Express } from 'express';
import authRouter from '../routes/auth.route';
import userRouter from '../routes/user.route';
import { isAuthenticated } from '@trg_package/middlewares';
import tenantRouter from '../routes/tenant.route';

const routesLoader = (app: Express) => {
  app.use('/api/v1/auth', authRouter);
  // app.use(isAuthenticated);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/tenants', tenantRouter);
};

export default routesLoader;
