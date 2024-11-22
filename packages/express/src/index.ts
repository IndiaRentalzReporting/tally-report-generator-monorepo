import 'express-async-errors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from '@trg_package/middlewares';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import { sessionsLoader } from './loaders/sessions';
import { removePrivate } from './middleware/removePrivate';
import { passportLoader } from './loaders/passport';

const { NODE_ENV, DOMAIN, TLD } = config;

export const expressLoader = async ({
  routesLoader
}: {
  routesLoader: (app: Express) => void;
}): Promise<Express> => {
  const app = express();

  app.use(cookieParser());
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

  app.use(removePrivate);

  sessionsLoader(app);

  passportLoader(app);

  routesLoader(app);

  app.use(notFound());
  app.use(errorHandler(NODE_ENV));

  return app;
};
