import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/AuthService';
import { UserInsert, UserSelect } from '../models/schema';

export const handleRegister = async (
  req: Request<object, object, UserInsert>,
  res: Response<UserSelect>,
  next: NextFunction
) => {
  try {
    const customer = await AuthService.register(req.body);
    res.json(customer);
  } catch (err) {
    console.error(`Could not register the User`);
    next(err);
  }
};

export const handleLogin = async (
  req: Request<object, object, UserInsert>,
  res: Response<UserSelect>,
  next: NextFunction
) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(`Could not login the User`);
    next(err);
  }
};
