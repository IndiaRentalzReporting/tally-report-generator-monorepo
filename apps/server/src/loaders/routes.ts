import { Express } from 'express';
import authRouter from '../routes/auth.route';
import roleRouter from '../routes/role.route';
import userRouter from '../routes/user.route';
import { isAdmin } from '../middlewares';

const routesLoader = (app: Express) => {
  app.use('/auth', authRouter);
  app.use('/role', isAdmin, roleRouter);
  app.use('/user', isAdmin, userRouter);
};

export default routesLoader;
