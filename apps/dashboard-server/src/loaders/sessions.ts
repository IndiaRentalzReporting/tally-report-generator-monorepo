import { Express } from 'express';
import MongoStore from 'connect-mongo';
import session, { SessionOptions } from 'express-session';
import config from '../config';

const sessionsLoader = (app: Express) => {
  try {
    const { SESSION_SECRET } = config.session;
    const { NODE_ENV } = config.server;
    const { MONGO_URI } = config.mongo;

    let sessionStore;
    try {
      sessionStore = MongoStore.create({
        mongoUrl: MONGO_URI
      });
    } catch (err) {
      console.error('Could not connect to the Session Database');
      throw err;
    }

    const sessionObject: SessionOptions = {
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 4 // 4 hours,
      },
      store: sessionStore
    };

    if (NODE_ENV === 'production' && sessionObject.cookie) {
      app.set('trust proxy', 1);
      sessionObject.cookie.httpOnly = true;
      sessionObject.cookie.secure = true;
    }

    app.use(session(sessionObject));
  } catch (error) {
    console.error('Could not setup the Sessions Library!');
    throw error;
  }
};

export default sessionsLoader;
