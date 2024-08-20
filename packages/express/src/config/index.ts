const MONGO_USERNAME = 'himanshu';
const MONGO_PASSWORD = 'Himkap%401705';
const MONGO_DB_NAME = 'trg_development_sessions';
const AUTH_PG_HOST = 'localhost';
const AUTH_PG_PORT = '5432';
const AUTH_PG_PASSWORD = '';
const AUTH_PG_USER = 'postgres';
const AUTH_PG_DATABASE = 'trg_auth';

export default {
  NODE_ENV: 'development',

  SESSION_SECRET: 'thisisasessionsecret',

  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB_NAME,
  MONGO_URI: `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.87rgavf.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`,

  AUTH_PG_HOST,
  AUTH_PG_PORT,
  AUTH_PG_PASSWORD,
  AUTH_PG_USER,
  AUTH_PG_DATABASE,
  AUTH_PG_URL: `postgresql://${AUTH_PG_USER}:${AUTH_PG_PASSWORD}@${AUTH_PG_HOST}:${AUTH_PG_PORT}/${AUTH_PG_DATABASE}`
};
