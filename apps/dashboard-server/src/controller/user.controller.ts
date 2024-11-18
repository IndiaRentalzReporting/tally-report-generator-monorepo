import { NextFunction, Request, Response } from 'express';
import {
  UserSelect,
  DetailedUser,
  UserInsert
} from '@trg_package/schemas-dashboard/types';

export const createOne = async (
  req: Request<object, object, UserInsert>,
  res: Response<{ user: DetailedUser }>,
  next: NextFunction
) => {
  try {
    const user = (await req.services.user.createOne({
      ...req.body,
    })) as DetailedUser;
    return res.json({
      user
    });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object,object,object, Partial<UserSelect>>,
  res: Response<{ users: Array<DetailedUser> }>,
  next: NextFunction
) => {
  try {
    const users = await req.services.user.findMany({
      ...req.query
    }) as Array<DetailedUser>;
    return res.json({
      users
    });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<UserSelect, 'id'>, object, Partial<UserSelect>>,
  res: Response<{ user: UserSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await req.services.user.updateOne(
      { id },
      req.body
    );

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: UserSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await req.services.user.deleteOne({ id });

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};
