import { Express } from 'express';
import passport from 'passport';
import LocalStrategy, {
  VerifyFunction,
  IStrategyOptions
} from 'passport-local';
import UserService from '../services/UserService';
import AuthService from '../services/AuthService';

const passportLoader = (app: Express) => {
  const customFields: IStrategyOptions = {
    usernameField: 'email'
  };

  const verifyCallback: VerifyFunction = async (email, password, done) => {
    try {
      const user = await AuthService.signIn({ email, password });
      return done(null, user);
    } catch (e) {
      console.error(`Error while authenticating the User`);
      return done(e);
    }
  };

  const localStrategy = new LocalStrategy.Strategy(
    customFields,
    verifyCallback
  );

  passport.use(localStrategy);

  passport.serializeUser(async (user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser((email: string, done) => {
    UserService.findOne({ email })
      .then((user) => done(null, user))
      .catch((e) => done(e));
  });

  app.use(passport.initialize());
  app.use(passport.session());
};

export default passportLoader;
