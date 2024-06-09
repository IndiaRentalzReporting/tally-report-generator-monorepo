import { Express } from 'express';
import authRouter from '../routes/auth.route';
import roleRouter from '../routes/role.route';
import userRouter from '../routes/user.route';

const routesLoader = (app: Express) => {
  app.use('/auth', authRouter);
  app.use('/role', roleRouter);
  app.use('/user', userRouter);
};

export default routesLoader;
