import { NextFunction, Request, Response } from 'express';
import {
  UserSelect
} from '@trg_package/schemas-dashboard/types';
import { UnauthenticatedError } from '@trg_package/errors';

export const updateOne = async (
  req: Request<Pick<UserSelect, 'id'>, object, Partial<UserSelect>>,
  res: Response<{ user: UserSelect }>,
  next: NextFunction
) => {
  try {
    const { user: sessionUser } = req;

    if (!sessionUser) {
      throw new UnauthenticatedError('Not logged in');
    }

    const { id } = sessionUser;
    console.log(req.body);
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
    const { user: sessionUser } = req;

    if (!sessionUser) {
      throw new UnauthenticatedError('Not logged in');
    }

    const { id } = sessionUser;
    const user = await req.services.user.deleteOne({ id });

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};
