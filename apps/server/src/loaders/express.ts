import 'express-async-errors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler, notFound } from '../middlewares';
import sessionsLoader from './sessions';
import passportLoader from './passport';
import routesLoader from './routes';

dotenv.config();

const expressLoader = (): Express => {
  const app = express();

  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());

  sessionsLoader(app);
  passportLoader(app);

  routesLoader(app);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default expressLoader;
