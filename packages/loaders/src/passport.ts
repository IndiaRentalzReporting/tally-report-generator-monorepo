import { Express } from 'express';
import passport from 'passport';
import LocalStrategy, {
  VerifyFunction,
  IStrategyOptions
} from 'passport-local';
import { ICallbacks } from './express';

export const passportLoader = (
  app: Express,
  verifyCallback: ICallbacks['verifyCallback'],
  serializeUserCallback: ICallbacks['serializeUserCallback'],
  deserializeUserCallback: ICallbacks['deserializeUserCallback']
) => {
  const customFields: IStrategyOptions = {
    usernameField: 'email'
  };

  const localStrategy = new LocalStrategy.Strategy(
    customFields,
    verifyCallback
  );

  passport.use(localStrategy);

  passport.serializeUser(serializeUserCallback);
  passport.deserializeUser(deserializeUserCallback);

  app.use(passport.initialize());
  app.use(passport.session());
};
