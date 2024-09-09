import 'express-async-errors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from '@trg_package/middlewares';
import cors from 'cors';
import config from './config';
import { sessionsLoader } from './loaders/sessions';

const { NODE_ENV, DOMAIN, TLD } = config;

export const expressLoader = async ({
  routesLoader,
  passportLoader
}: {
  routesLoader: (app: Express) => void;
  passportLoader?: (app: Express) => void;
}): Promise<Express> => {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(
    cors({
      origin: new RegExp(`${DOMAIN}\\.${TLD}$`),
      credentials: true
    })
  );

  sessionsLoader(app);
  passportLoader && passportLoader(app);

  routesLoader(app);

  app.use(notFound());
  app.use(errorHandler(NODE_ENV));

  return app;
};
