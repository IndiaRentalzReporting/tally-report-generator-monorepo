import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import { Express } from 'express';
import routesLoader from './routes';
import config from '../config';
import { expressLoader } from '@trg_package/loaders';
import { connectionCallback } from './database';
import {
  verifyCallback,
  serializeUserCallback,
  deserializeUserCallback
} from './passport';

dotenv.config();

const appLoader = async (): Promise<Express> => {
  const { MONGO_URI, SESSION_SECRET, NODE_ENV } = config;
  const app = await expressLoader(
    routesLoader,
    {
      MONGO_URI,
      SESSION_SECRET,
      NODE_ENV
    },
    {
      verifyCallback,
      serializeUserCallback,
      deserializeUserCallback,
      connectionCallback
    }
  );

  app.use(
    cors({
      origin: ['http://dashboard.trg.local', 'http://auth.trg.local'],
      credentials: true
    })
  );

  return app;
};

export default appLoader;
