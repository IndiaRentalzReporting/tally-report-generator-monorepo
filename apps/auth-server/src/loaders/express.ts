import { Express } from 'express';
import routesLoader from './routes';
import { expressLoader } from '@trg_package/express';
import config from '../config';
import { passportLoader } from './passport';
import { sessionsLoader } from './sessions';

const appLoader = async (): Promise<Express> => {
  const app = await expressLoader({
    routesLoader,
    passportLoader,
    sessionsLoader
  });

  return app;
};

export default appLoader;
