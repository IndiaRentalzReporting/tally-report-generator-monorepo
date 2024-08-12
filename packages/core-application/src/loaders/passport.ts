import { Express } from 'express';
import passport from 'passport';
import LocalStrategy, {
  VerifyFunction,
  IStrategyOptions
} from 'passport-local';

export const passportLoader = (
  app: Express,
  verifyCallback: VerifyFunction,
  serializeUserCallback: (
    user: Express.User,
    done: (err: any, id?: unknown) => void
  ) => void,
  deserializeUserCallback: (
    id: string,
    done: (err: any, user?: false | Express.User | null | undefined) => void
  ) => void
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
