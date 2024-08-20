import { VerifyFunction } from 'passport-local';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

export const verifyCallback: VerifyFunction = async (email, password, done) => {
  try {
    const user = await AuthService.signIn({ email, password });
    return done(null, user);
  } catch (e) {
    console.error(`Error while authenticating the User`);
    return done(e);
  }
};

export const serializeUserCallback = async (
  user: Express.User,
  done: (err: any, id?: unknown) => void
) => {
  done(null, {
    email: user.email,
    tenant: user.tenant_id
  });
};

export const deserializeUserCallback = async (
  userObject: {
    email: string;
    tenant: string;
  },
  done: (err: any, user?: false | Express.User | null | undefined) => void
) => {
  const { email, tenant } = userObject;
  try {
    const user = await UserService.findOne({
      email,
      tenant_id: tenant
    });
    if (user) done(null, user);
  } catch (e) {
    done(e);
  }
};
