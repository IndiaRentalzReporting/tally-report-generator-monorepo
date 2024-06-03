import dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

const {
  MONGO_PASSWORD = '',
  MONGO_USERNAME = '',
  MONGO_DB_NAME = 'db',
  PORT = '4000',
  SESSION_SECRET = '',
  NODE_ENV = 'development',
  PG_HOST,
  PG_PORT,
  PG_PASSWORD,
  PG_USER,
  PG_DATABASE
} = process.env;
const config = {
  mongo: {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_URI: `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@cluster0.87rgavf.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  },
  postgres: {
    PG_URL: `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`
  },
  server: {
    PORT,
    NODE_ENV
  },
  session: {
    SESSION_SECRET
  }
};

export default config;
