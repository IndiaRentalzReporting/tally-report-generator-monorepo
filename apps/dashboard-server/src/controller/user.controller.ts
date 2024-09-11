import { NextFunction, Request, Response } from 'express';
import {
  RoleSelect,
  UserSelect,
  DetailedUser,
  UserInsert
} from '@trg_package/schemas-dashboard/types';
import { NotFoundError } from '@trg_package/errors';

export const readAll = async (
  req: Request,
  res: Response<{ users: Omit<DetailedUser, 'password'>[] }>,
  next: NextFunction
) => {
  try {
    const usersWithPassword = await req.userService.findMany();
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

export const readOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: Omit<DetailedUser, 'password'> }>,
  next: NextFunction
) => {
  try {
    const user = await req.userService.findOneDetailedUser({
      id: req.params.id
    });

    const { password, ...userWithoutPassword } = user;
    return res.json({
      user: userWithoutPassword
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
      const { id } = await req.userService.updateOne(user_id, {
        role_id: roleId
      });

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
    const { password, ...user } = await req.userService.updateOne(
      req.params.id,
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
    const { password, ...user } = await req.userService.deleteOne(
      req.params.id
    );

    return res.json({ user });
  } catch (e) {
    return next(e);
  }
};
