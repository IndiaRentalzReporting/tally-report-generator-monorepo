import { VerifyFunction } from 'passport-local';
import AuthService from '../services/AuthService';
import UserService from '../services/AuthUserService';
import { DetailedUser } from '@trg_package/dashboard-schemas/types';

export const verifyCallback: VerifyFunction = async (email, password, done) => {
  try {
    const _ = (await AuthService.signIn({
      email,
      password
    })) as unknown as DetailedUser;
    return done(null, _);
  } catch (e) {
    console.error(`Error while authenticating the User`);
    return done(e);
  }
};

export const serializeUserCallback = async (
  user: Express.User,
  done: (err: any, id?: unknown) => void
) => {
  done(null, user.email);
};

export const deserializeUserCallback = async (
  user: {
    email: string;
    tenant: string;
  },
  done: (err: any, user?: false | Express.User | null | undefined) => void
) => {
  const { email } = user;
  try {
    const user = (await UserService.findOne({
      email
    })) as unknown as DetailedUser;
    if (user) done(null, user);
  } catch (e) {
    done(e);
  }
};
