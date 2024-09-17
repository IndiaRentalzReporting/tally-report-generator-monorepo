import { Express } from 'express';
import routesLoader from './routes';
import { expressLoader } from '@trg_package/express';
import { passportLoader } from './passport';

const appLoader = async (): Promise<Express> => {
  const app = await expressLoader({
    routesLoader,
    passportLoader
  });

  return app;
};

export default appLoader;
