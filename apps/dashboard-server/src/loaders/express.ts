import { Express } from 'express';
import { expressLoader } from '@trg_package/express';
import routesLoader from './routes';

const appLoader = async (): Promise<Express> => {
  const app = await expressLoader({ routesLoader });

  return app;
};

export default appLoader;
