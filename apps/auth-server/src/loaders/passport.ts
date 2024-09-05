import { Express } from 'express';
import passport from 'passport';
import LocalStrategy, {
  VerifyFunction,
  IStrategyOptions
} from 'passport-local';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

export const passportLoader = (app: Express) => {
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

  const serializeUserCallback = async (
    user: Express.User,
    done: (err: any, id?: unknown) => void
  ) => {
    done(null, {
      email: user.email,
      tenant: user.tenant_id
    });
  };

  const deserializeUserCallback = async (
    userObject: {
      email: string;
      tenant: string;
    },
    done: (err: any, user?: false | Express.User | null | undefined) => void
  ) => {
    const { email, tenant: tenant_id } = userObject;
    try {
      const user = await UserService.findOne({
        email,
        tenant_id
      });

      if (user) done(null, user);
    } catch (e) {
      done(e);
    }
  };

  passport.serializeUser(serializeUserCallback);
  passport.deserializeUser(deserializeUserCallback);

  app.use(passport.initialize());
  app.use(passport.session());
};
