import 'express-async-errors';
import express, {
  Request, Response, NextFunction, Express
} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from '@trg_package/middlewares';
import cors from 'cors';
import { DetailedUser as AuthDetailedUser } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/schemas-dashboard/types';
import config from './config';
import { sessionsLoader } from './loaders/sessions';
import { removePrivate } from './middleware/removePrivate';

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

  app.use(removePrivate);

  sessionsLoader(app);
  passportLoader && passportLoader(app);

  routesLoader(app);

  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(res.json);
    next();
  });

  app.use(notFound());
  app.use(errorHandler(NODE_ENV));

  return app;
};

declare global {
  namespace Express {
    interface User extends AuthDetailedUser, DashDetailedUser {}
  }
}
