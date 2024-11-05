import { NextFunction, Request, Response } from 'express';
import {
  UserSelect,
  UserInsert,
  SafeUserSelect
} from '@trg_package/schemas-auth/types';
import UserService from '../services/UserService';

export const createOne = async (
  req: Request<object, object, UserInsert>,
  res: Response<{ user: SafeUserSelect }>,
  next: NextFunction
) => {
  try {
    const { password, ...user } = await UserService.createOne(req.body);

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object,object,object, Partial<UserSelect>>,
  res: Response<{ users: SafeUserSelect[] }>,
  next: NextFunction
) => {
  try {
    const usersWithPassword = await UserService.findMany({
      ...req.query
    });
    const users = usersWithPassword.map(({ password, ...user }) => user);
    return res.json({
      users
    });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<UserSelect, 'id'>, object, Partial<UserInsert>>,
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { password, ...user } = await UserService.updateOne({ id }, req.body);

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { password, ...user } = await UserService.deleteOne({ id });

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};
