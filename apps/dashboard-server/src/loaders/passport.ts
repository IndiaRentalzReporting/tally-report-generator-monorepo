import { VerifyFunction } from 'passport-local';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';
import { DetailedUser } from '@fullstack_package/dashboard-schemas/schemas';

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
  done(null, user.email);
};

export const deserializeUserCallback = async (
  email: string,
  done: (err: any, user?: false | Express.User | null | undefined) => void
) => {
  try {
    const user = (await UserService.findOneDetailedUser({
      email
    })) as DetailedUser;
    if (user) done(null, user);
  } catch (e) {
    done(e);
  }
};
