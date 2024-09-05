import { Express } from 'express';
import MongoStore from 'connect-mongo';
import session, { SessionOptions } from 'express-session';
import config from '../config';
import { BadRequestError, DatabaseError } from '@trg_package/errors';

export const sessionsLoader = (app: Express) => {
  const { SESSION_SECRET, MONGO_URL, NODE_ENV } = config;
  try {
    let sessionStore;
    try {
      sessionStore = MongoStore.create({
        mongoUrl: MONGO_URL
      });
    } catch (err) {
      throw new DatabaseError('Could not connect to the Session Database');
    }

    const sessionObject: SessionOptions = {
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 4, // 4 hours,
        sameSite: 'lax',
        domain: '.trg.local'
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
    throw new BadRequestError('Could not setup the Sessions Library!');
  }
};
