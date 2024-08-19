import 'express-async-errors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from '@trg_package/middlewares';
import { sessionsLoader } from './sessions';
import { passportLoader } from './passport';
import { VerifyFunction } from 'passport-local';
import { connectAndLog } from './database';

interface IRoutesLoader {
  (app: Express): void;
}

interface IConfig {
  NODE_ENV: string;
  SESSION_SECRET: string;
  MONGO_URI: string;
}

interface ICallbacks {
  connectionCallback: () => Promise<void>;
  verifyCallback: VerifyFunction;
  serializeUserCallback: (
    user: Express.User,
    done: (err: any, id?: unknown) => void
  ) => void;
  deserializeUserCallback: (
    id: string,
    done: (err: any, user?: false | Express.User | null | undefined) => void
  ) => void;
}

export const expressLoader = async (
  routesLoader: IRoutesLoader,
  { NODE_ENV, SESSION_SECRET, MONGO_URI }: IConfig,
  {
    connectionCallback,
    verifyCallback,
    serializeUserCallback,
    deserializeUserCallback
  }: ICallbacks
): Promise<Express> => {
  await connectAndLog(connectionCallback);
  const app = express();

  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  sessionsLoader(app, { SESSION_SECRET, MONGO_URI, NODE_ENV });
  passportLoader(
    app,
    verifyCallback,
    serializeUserCallback,
    deserializeUserCallback
  );
  routesLoader(app);

  app.use(notFound());
  app.use(errorHandler(NODE_ENV));

  return app;
};
