import { Express } from 'express';
import authRouter from '../routes/auth.route';
import userRouter from '../routes/user.route';
import { isAuthenticated } from '../middlewares';

const routesLoader = (app: Express) => {
  app.use('api/v1/auth', authRouter);
  app.use(isAuthenticated);
  app.use('api/v1/users', userRouter);
};

export default routesLoader;
