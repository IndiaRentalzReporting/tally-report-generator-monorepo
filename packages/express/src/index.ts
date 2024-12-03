import 'express-async-errors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { DetailedUser as AuthDetailedUser } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/schemas-dashboard/types';
import config from './config';
import { sessionsLoader } from './loaders/sessions';
import { removePrivate, errorHandler, notFound } from './middleware';
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

declare global {
  namespace Express {
    interface User extends AuthDetailedUser, DashDetailedUser {}
  }
}

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user?: {
        email: string;
        tenant_id: string;
      };
    };
  }
}
