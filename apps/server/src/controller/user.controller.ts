import { NextFunction, Request, Response } from 'express';
import UserService from '../services/UserService';
import { RoleSelect, UserSelect } from '../models/schema';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await UserService.getAll(req.user?.id ?? '');
    res.json({
      users
    });
  } catch (e) {
    console.error("Couldn't fetch all Users!");
    next(e);
  }
};

export const assignRole = async (
  req: Request<
    object,
    object,
    { userIds: UserSelect['id'][]; roleId: RoleSelect['id'] }
  >,
  res: Response<{ userIds: string[] }>,
  next: NextFunction
) => {
  try {
    const userIds = await UserService.assignRole(
      req.body.userIds,
      req.body.roleId
    );

    res.json({ userIds });
  } catch (e) {
    console.error("Couldn't assign UserRoleRelation to a role");
    next(e);
  }
};
