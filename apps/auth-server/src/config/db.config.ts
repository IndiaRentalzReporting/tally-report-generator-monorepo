import dotenv from 'dotenv';
const { NODE_ENV } = process.env;
dotenv.config({ path: `.env.${NODE_ENV}` });

const {
  MONGO_PASSWORD = '',
  MONGO_USERNAME = '',
  MONGO_DB_NAME = 'db',

  PG_HOST,
  PG_PORT,
  PG_PASSWORD,
  PG_USER,
  PG_DATABASE
} = process.env;

export const dbConfig = {
  db: {
    mongo: {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_URI: `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@cluster0.87rgavf.mongodb.net/${MONGO_DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
    },
    postgres: {
      PG_URL: `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`,
      PG_HOST,
      PG_PORT,
      PG_PASSWORD,
      PG_USER,
      PG_DATABASE
    }
  }
};
