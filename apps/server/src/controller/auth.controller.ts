import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { UserInsert, UserSelect } from '../models/schema';

export const handleSignUp = async (
  req: Request<object, object, UserInsert>,
  res: Response<UserSelect>,
  next: NextFunction
) => {
  try {
    const user = await AuthService.signUp(req.body);
    res.json(user);
  } catch (err) {
    console.error(`Could not sign up the User`);
    next(err);
  }
};

export const handleSignIn = async (
  req: Request<object, object, UserInsert>,
  res: Response<UserSelect>,
  next: NextFunction
) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(`Could not sign in the User`);
    next(err);
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
  res: Response<{ user: UserSelect | null; isAuthenticated: boolean }>
) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user,
      isAuthenticated: true
    });
    return;
  }
  res.json({
    user: null,
    isAuthenticated: false
  });
};
