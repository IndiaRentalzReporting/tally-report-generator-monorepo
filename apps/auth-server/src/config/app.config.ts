import dotenv from 'dotenv';
const { NODE_ENV } = process.env;
dotenv.config({ path: `.env.${NODE_ENV}` });

const {
  PORT = '4000',
  SESSION_SECRET = '',
  FRONTEND_URL = '',

  SUPER_USER_NAME = '',
  DEVELOPER_FIRST_NAME,
  DEVELOPER_LAST_NAME,
  DEVELOPER_EMAIL,
  DEVELOPER_PASSWORD
} = process.env;

export const appConfig = {
  app: {
    SUPER_USER_NAME,
    DEVELOPER_FIRST_NAME,
    DEVELOPER_LAST_NAME,
    DEVELOPER_EMAIL,
    DEVELOPER_PASSWORD,
    PORT: Number(PORT),
    FRONTEND_URL,
    SESSION_SECRET
  }
};
