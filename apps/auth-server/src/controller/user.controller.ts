import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import {
  UserSelect,
  UserInsert,
  SafeUserSelect
} from '@trg_package/auth-schemas/types';
import { NotFoundError } from '@trg_package/errors';

export const readAll = async (
  req: Request,
  res: Response<{ users: SafeUserSelect[] }>,
  next: NextFunction
) => {
  try {
    const usersWithPassword = await UserService.findMany();
    const users = usersWithPassword.map(({ password, ...user }) => user);
    return res.json({
      users
    });
  } catch (e) {
    console.error("Couldn't fetch all Users!");
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: SafeUserSelect }>,
  next: NextFunction
) => {
  try {
    const user = await UserService.findOne({
      id: req.params.id
    });

    if (!user) throw new NotFoundError('User does not exist');

    const { password, ...userWithoutPassword } = user;
    return res.json({
      user: userWithoutPassword
    });
  } catch (e) {
    console.error("Couldn't fetch all Users!");
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<UserSelect, 'id'>, object, Partial<UserInsert>>,
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { password, ...user } = await UserService.updateOne(
      req.params.id,
      req.body
    );

    return res.json({ user });
  } catch (e) {
    console.error("Couldn't delete a user");
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { password, ...user } = await UserService.deleteOne(req.params.id);

    return res.json({ user });
  } catch (e) {
    console.error("Couldn't delete a user");
    return next(e);
  }
};
