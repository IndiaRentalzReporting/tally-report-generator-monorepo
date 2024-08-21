import 'express-async-errors';
import cors from 'cors';
import { Express } from 'express';
import routesLoader from './routes';
import { expressLoader } from '@trg_package/express';

const appLoader = async (): Promise<Express> => {
  const app = await expressLoader(routesLoader);

  app.use(
    cors({
      origin: ['http://dashboard.trg.local', 'http://auth.trg.local'],
      credentials: true
    })
  );

  return app;
};

export default appLoader;
