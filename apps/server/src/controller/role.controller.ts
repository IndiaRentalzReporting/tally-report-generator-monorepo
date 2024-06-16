import { NextFunction, Request, Response } from 'express';
import {
  ActionSelect,
  ModuleSelect,
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

export const createOne = async (
  req: Request<object, object, Pick<RoleInsert, 'name'>>,
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
    {
      permissions: {
        module_id: ModuleSelect['id'];
        action_id: ActionSelect['id'];
      }[];
      roleId: RoleSelect['id'];
    }
  >,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const promises = req.body.permissions.map(
      async ({ module_id, action_id }) =>
        RoleService.assignPermission({ module_id, action_id }, req.body.roleId)
    );

    res.json({ permissions: await Promise.all(promises) });
  } catch (e) {
    console.error("Couldn't assign permissions to a role");
    next(e);
  }
};
