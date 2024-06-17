import { NextFunction, Request, Response } from 'express';
import {
  ActionSelect,
  ModuleSelect,
  PermissionSelect,
  RoleInsert,
  RoleSelect
} from '../models/schema';
import RoleService from '../services/RoleService';

export const readAll = async (
  req: Request,
  res: Response<{ roles: RoleSelect[] }>,
  next: NextFunction
) => {
  try {
    const roles = await RoleService.readAll();
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
