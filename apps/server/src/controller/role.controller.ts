import { Request, Response } from 'express';
import {
  PermissionInsert,
  PermissionSelect,
  RoleInsert,
  RoleSelect
} from '../models/schema';
import RoleService from '../services/RoleService';
import { CustomError } from '../errors';

export const createRole = async (
  req: Request<object, object, RoleInsert>,
  res: Response<{ role: RoleSelect }>
) => {
  try {
    const role = await RoleService.createOne(req.body);
    res.json({
      role
    });
  } catch (e) {
    console.error("Couldn't create a new Role", e);
    throw new CustomError(
      `Error occurred while creating a new Role: ${e}`,
      500
    );
  }
};

export const assignPermission = async (
  req: Request<
    object,
    object,
    { permissions: PermissionInsert; roleId: string }
  >,
  res: Response<{ permissions: PermissionSelect }>
) => {
  try {
    const permissions = await RoleService.assignPermissions(
      req.body.permissions,
      req.body.roleId
    );

    res.json({ permissions });
  } catch (e) {
    console.error("Couldn't assign permissions to a role", e);
    throw new CustomError(
      `Error occurred while assigning permissions to a role: ${e}`,
      500
    );
  }
};
