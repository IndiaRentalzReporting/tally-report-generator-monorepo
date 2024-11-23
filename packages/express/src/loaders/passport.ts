import { Express, Request } from 'express';
import passport from 'passport';
import LocalStrategy, {
  VerifyFunction,
  IStrategyOptions
} from 'passport-local';
import { DetailedUser as AuthDetailedUser } from '@trg_package/schemas-auth/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/schemas-dashboard/types';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import TenantService from '../services/tenant.service';
import UserTenantService from '../services/user_tenant.service';

declare global {
  namespace Express {
    interface User extends AuthDetailedUser, DashDetailedUser {}
    interface Response {
      originalJson(body: any): Response;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    passport?: {
      user?: {
        email: string;
        tenant_id: string;
      };
    };
  }
}

export const passportLoader = (app: Express) => {
  const customFields: IStrategyOptions = {
    usernameField: 'email'
  };

  const verifyCallback: VerifyFunction = async (email, password, done) => {
    try {
      const user = await AuthService.signIn({ email, password });
      return done(null, user);
    } catch (e) {
      console.error('Error while authenticating the User');
      return done(e);
    }
  };

  const localStrategy = new LocalStrategy.Strategy(
    customFields,
    verifyCallback
  );

  passport.use(localStrategy);

  const serializeUserCallback = async (
    user: NonNullable<Request['user']>,
    done: (err: any, id?: unknown) => void
  ) => {
    done(null, {
      email: user.email,
      tenant_id: user.tenant.id
    });
  };

  const deserializeUserCallback = async (
    userObject: {
      email: string;
      tenant_id: string;
    },
    done: (
      err: any,
      user?: false | NonNullable<Request['user']> | null | undefined
    ) => void
  ) => {
    const { email, tenant_id } = userObject;
    try {
      const user = await UserService.findOneWithTenant({
        email
      }, tenant_id);

      const tenant = await TenantService.findOne({
        id: tenant_id
      });

      await UserTenantService.findOne({
        user_id: user.id,
        tenant_id
      });

      if (user) {
        user.tenant = tenant;
        return done(null, user);
      }
      return done(null, false);
    } catch (e) {
      done(e);
    }
  };

  passport.serializeUser(serializeUserCallback);
  passport.deserializeUser(deserializeUserCallback);

  app.use(passport.initialize());
  app.use(passport.session());
};
