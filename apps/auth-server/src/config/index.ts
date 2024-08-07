import dotenv from 'dotenv';
const { NODE_ENV } = process.env;
dotenv.config({ path: `.env.${NODE_ENV}` });

import { appConfig } from './app.config';
import { dbConfig } from './db.config';

export type env = 'production' | 'development' | 'staging';

const config = {
  ...appConfig,
  ...dbConfig,
  NODE_ENV: NODE_ENV as env
};

console.log('config', config);

export default config;
