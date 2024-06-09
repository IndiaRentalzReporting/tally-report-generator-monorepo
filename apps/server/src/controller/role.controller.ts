import { NextFunction, Request, Response } from 'express';
import {
  PermissionInsert,
  PermissionSelect,
  RoleInsert,
  RoleSelect
} from '../models/schema';
import RoleService from '../services/RoleService';

export const getAll = async (
  req: Request,
  res: Response<{ roles: RoleSelect[] }>,
  next: NextFunction
) => {
  try {
    const roles = await RoleService.getAll();
    res.json({ roles });
  } catch (e) {
    console.error("Couldn't fetch all Roles");
    next(e);
  }
};

export const create = async (
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
