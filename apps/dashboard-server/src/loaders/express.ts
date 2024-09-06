import { Express } from 'express';
import routesLoader from './routes';
import { expressLoader } from '@trg_package/express';
import { attachPGDashboard } from '../middlewares/attachPGDashboard';

const appLoader = async (): Promise<Express> => {
  const app = await expressLoader({ routesLoader });

  app.use(attachPGDashboard);

  return app;
};

export default appLoader;
