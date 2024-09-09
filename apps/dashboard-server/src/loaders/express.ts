import { Express } from 'express';
import routesLoader from './routes';
import { expressLoader } from '@trg_package/express';

const appLoader = async (): Promise<Express> => {
  const app = await expressLoader({ routesLoader });

  return app;
};

export default appLoader;
