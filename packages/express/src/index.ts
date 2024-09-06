import 'express-async-errors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from '@trg_package/middlewares';
import cors from 'cors';

export const expressLoader = async ({
  NODE_ENV,
  routesLoader,
  passportLoader,
  sessionsLoader
}: {
  NODE_ENV: string;
  routesLoader: (app: Express) => void;
  passportLoader?: (app: Express) => void;
  sessionsLoader?: (app: Express) => void;
}): Promise<Express> => {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(
    cors({
      origin: ['http://dashboard.trg.local', 'http://auth.trg.local'],
      credentials: true
    })
  );

  sessionsLoader && sessionsLoader(app);
  passportLoader && passportLoader(app);

  routesLoader(app);

  app.use(notFound());
  app.use(errorHandler(NODE_ENV));

  return app;
};
