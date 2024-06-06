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
