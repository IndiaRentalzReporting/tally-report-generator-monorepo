import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import { RoleSelect, UserSelect, DetailedUser } from '../models/schema';

export const readAll = async (
  req: Request,
  res: Response<{ users: Omit<DetailedUser, 'password'>[] }>,
  next: NextFunction
) => {
  try {
    const users = await UserService.readAll(req.user?.id ?? '');
    res.json({
      users
    });
  } catch (e) {
    console.error("Couldn't fetch all Users!");
    next(e);
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
  try {
    const userIds = await UserService.updateRole(
      req.body.userIds,
      req.body.roleId
    );

    res.json({ userIds });
  } catch (e) {
    console.error("Couldn't assign a role to users");
    next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<UserSelect, 'id'>>,
  res: Response<{ user: Omit<UserSelect, 'password'> }>,
  next: NextFunction
) => {
  try {
    const user = await UserService.deleteUser(req.params.id);

    res.json({ user });
  } catch (e) {
    console.error("Couldn't delete a user");
    next(e);
  }
};
