import dotenv from 'dotenv';

const { NODE_ENV } = process.env;
dotenv.config({ path: `.env.${NODE_ENV}` });

type env = 'production' | 'development' | 'staging';
const {
  PORT = '4000',
  SESSION_SECRET = '',
  FRONTEND_URL = '',

  MONGO_PASSWORD = '',
  MONGO_USERNAME = '',
  MONGO_DB_NAME = 'db',

  PG_HOST,
  PG_PORT,
  PG_PASSWORD,
  PG_USER,
  PG_DATABASE,

  SUPER_USER_NAME = '',
  DEVELOPER_FIRST_NAME,
  DEVELOPER_LAST_NAME,
  DEVELOPER_EMAIL,
  DEVELOPER_PASSWORD,

  MAIL_FROM = '',
  SMTP_SECRET = '',
  SMTP_PASS = '',
  SMTP_HOST = '',
  SMTP_PORT = '',
  SMTP_USER = ''
} = process.env;
const config = {
  app: {
    SUPER_USER_NAME,
    DEVELOPER_FIRST_NAME,
    DEVELOPER_LAST_NAME,
    DEVELOPER_EMAIL,
    DEVELOPER_PASSWORD
  },
  mongo: {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_URI: `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@cluster0.87rgavf.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  },
  postgres: {
    PG_URL: `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}${NODE_ENV !== 'development' ? '?sslmode=require' : ''}`,
    PG_HOST,
    PG_PORT,
    PG_PASSWORD,
    PG_USER,
    PG_DATABASE
  },
  server: {
    PORT: Number(PORT),
    NODE_ENV: NODE_ENV as env,
    FRONTEND_URL
  },
  session: {
    SESSION_SECRET
  },
  emailing: {
    MAIL_FROM,
    SMTP_HOST,
    SMTP_PASS,
    SMTP_PORT: Number(SMTP_PORT),
    SMTP_SECRET,
    SMTP_USER
  }
};

export default config;
