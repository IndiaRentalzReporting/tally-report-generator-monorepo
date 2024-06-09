import { NextFunction, Request, Response } from 'express';
import {
  PermissionInsert,
  PermissionSelect,
  RoleInsert,
  RoleSelect,
  UserRoleSelect
} from '../models/schema';
import RoleService from '../services/RoleService';
import { CustomError } from '../errors';
import UserService from '../services/UserService';

export const createRole = async (
  req: Request<object, object, RoleInsert>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await RoleService.createOne(req.body);
    res.json({
      role
    });
  } catch (e) {
    console.error("Couldn't create a new Role");
    next(e);
  }
};

export const assignPermission = async (
  req: Request<
    object,
    object,
    { permissions: PermissionInsert; roleId: string }
  >,
  res: Response<{ permissions: PermissionSelect }>,
  next: NextFunction
) => {
  try {
    const permissions = await RoleService.assignPermissions(
      req.body.permissions,
      req.body.roleId
    );

    res.json({ permissions });
  } catch (e) {
    console.error("Couldn't assign permissions to a role");
    next(e);
  }
};

export const assignRole = async (
  req: Request<object, object, { userIds: string[]; roleId: string }>,
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
