import 'express-async-errors';
import cors from 'cors';
import { Express } from 'express';
import routesLoader from './routes';
import { expressLoader } from '@trg_package/express';
import config from '../config';
import { passportLoader } from './passport';
import { sessionsLoader } from './sessions';

const { NODE_ENV } = config;
const appLoader = async (): Promise<Express> => {
  const app = await expressLoader({
    NODE_ENV,
    routesLoader,
    passportLoader,
    sessionsLoader
  });

  app.use(
    cors({
      origin: ['http://dashboard.trg.local', 'http://auth.trg.local'],
      credentials: true
    })
  );

  return app;
};

export default appLoader;
