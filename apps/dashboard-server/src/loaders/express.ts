import 'express-async-errors';
import cors from 'cors';
import { Express } from 'express';
import routesLoader from './routes';
import { expressLoader } from '@trg_package/express';
import config from '../config';
import { attachPGDashboard } from '../middlewares/attachPGDashboard';

const { NODE_ENV } = config;
const appLoader = async (): Promise<Express> => {
  const app = await expressLoader(NODE_ENV, routesLoader);

  app.use(
    cors({
      origin: ['http://dashboard.trg.local', 'http://auth.trg.local'],
      credentials: true
    })
  );

  app.use(attachPGDashboard);

  return app;
};

export default appLoader;
