import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { UserInsert, UserSelect, DetailedUser } from '../models/schema';
import { UnauthenticatedError } from '../errors';

export const handleSignUp = async (
  req: Request<object, object, UserInsert>,
  res: Response<Omit<UserSelect, 'password'>>,
  next: NextFunction
) => {
  try {
    const user = await AuthService.signUp(req.body);
    return res.json(user);
  } catch (err) {
    console.error(`Could not sign up the User`);
    return next(err);
  }
};

export const handleSignIn = async (
  req: Request<object, object, UserInsert>,
  res: Response<{ user: Omit<DetailedUser, 'password'> }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const { password, ...user } = req.user;
      return res.json({ user });
    }
    throw new UnauthenticatedError('Not logged in');
  } catch (err) {
    console.error(`Could not sign in the User`);
    return next(err);
  }
};

export const handleLogout = (
  req: Request,
  res: Response<{ message: string }>,
  next: NextFunction
) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie('connect.sid', { path: '/' }); // 'connect.sid' is the default session cookie name
      return res.json({ message: 'Logged Out' });
    });
  });
};

export const handleStatusCheck = (
  req: Request,
  res: Response<{
    user: Omit<DetailedUser, 'password'> | null;
    isAuthenticated: boolean;
  }>,
  next: NextFunction
) => {
  try {
    if (req.isAuthenticated()) {
      const {
        user: { password, ...userWithoutPassword }
      } = req;
      console.log({ userWithoutPassword });
      return res.json({
        user: userWithoutPassword,
        isAuthenticated: true
      });
      return;
    }
    return res.json({
      user: null,
      isAuthenticated: false
    });
  } catch (e) {
    console.error(`Couldn't check the status`);
    return next(e);
  }
};
