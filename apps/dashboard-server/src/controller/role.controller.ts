import { NextFunction, Request, Response } from 'express';
import { RoleInsert, RoleSelect } from '@trg_package/dashboard-schemas/types';

export const readAll = async (
  req: Request,
  res: Response<{ roles: RoleSelect[] }>,
  next: NextFunction
) => {
  try {
    const roles = await req.roleService.findMany({});
    return res.json({ roles });
  } catch (e) {
    return next(e);
  }
};

export const readOne = async (
  req: Request<Pick<RoleSelect, 'id'>>,
  res: Response<{ role: any }>,
  next: NextFunction
) => {
  try {
    const role = await req.roleService.findOne({ id: req.params.id });
    return res.json({ role });
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
