import { NextFunction, Request, Response } from 'express';
import {
  RoleSelect,
  UserSelect,
  DetailedUser,
  UserInsert
} from '@trg_package/schemas-dashboard/types';

export const createOne = async (
  req: Request<object, object, UserInsert>,
  res: Response<{ user: Omit<DetailedUser, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { password, ...user } = (await req.userService.createOne({
      ...req.body,
      isPrivate: false
    })) as DetailedUser;
    return res.json({
      user
    });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object, Partial<UserSelect>>,
  res: Response<{ users: Omit<DetailedUser, 'password'>[] }>,
  next: NextFunction
) => {
  try {
    const usersWithPassword = await req.userService.findMany({
      ...req.query
    });
    const users = usersWithPassword.map(
      ({ password, ...user }) => user
    ) as Omit<DetailedUser, 'password'>[];
    return res.json({
      users
    });
  } catch (e) {
    return next(e);
  }
};

export const updateRole = async (
  req: Request<
    object,
    object,
  { userIds: UserSelect['id'][]; roleId: RoleSelect['id'] }
  >,
  res: Response<{ userIds: string[] }>,
  next: NextFunction
) => {
  const { userIds, roleId } = req.body;
  try {
    const updatedUserIds = userIds.map(async (user_id) => {
      const { id } = await req.userService.updateOne(
        { id: user_id },
        {
          role_id: roleId
        }
      );

      return id;
    });

    return Promise.all(updatedUserIds).then((res) => res);
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
    const { password, ...user } = await req.userService.updateOne(
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
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { password, ...user } = await req.userService.deleteOne({ id });

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};
