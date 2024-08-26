import 'express-async-errors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from '@trg_package/middlewares';
import { sessionsLoader } from './loaders/sessions';
import { passportLoader } from './loaders/passport';
import config from './config';
import { attachPGDashboard } from './middlewares';
import { UserSelect } from '@trg_package/auth-schemas/types';
import { DetailedUser } from '@trg_package/dashboard-schemas/types';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dashboardSchemas from '@trg_package/dashboard-schemas/schemas';

export const expressLoader = async (
  routesLoader: (app: Express) => void
): Promise<Express> => {
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  sessionsLoader(app);
  passportLoader(app);

  app.use(attachPGDashboard);

  routesLoader(app);

  const { NODE_ENV } = config;
  app.use(notFound());
  app.use(errorHandler(NODE_ENV));

  return app;
};

export * from './models';
