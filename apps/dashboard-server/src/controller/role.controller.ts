import { NextFunction, Request, Response } from 'express';
import {
  RoleInsert,
  RoleSelect,
  RoleWithPermission
} from '@trg_package/schemas-dashboard/types';

export const readAll = async (
  req: Request<object, Partial<RoleSelect>>,
  res: Response<{ roles: RoleWithPermission[] }>,
  next: NextFunction
) => {
  try {
    const roles = (await req.roleService.findMany({
      ...req.query
    })) as RoleWithPermission[];
    return res.json({ roles });
  } catch (e) {
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, Pick<RoleInsert, 'name'>>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await req.roleService.createOne(req.body);
    return res.json({
      role
    });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<RoleSelect, 'id'>, object, Pick<RoleSelect, 'name'>>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await req.roleService.updateOne(req.params.id, req.body);
    return res.json({
      role
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<RoleSelect, 'id'>>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await req.roleService.deleteOne(req.params.id);
    return res.json({
      role
    });
  } catch (e) {
    return next(e);
  }
};
