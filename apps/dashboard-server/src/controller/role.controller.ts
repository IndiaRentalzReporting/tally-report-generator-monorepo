import { NextFunction, Request, Response } from 'express';
import {
  RoleInsert,
  RoleSelect,
  RoleWithPermission
} from '@trg_package/schemas-dashboard/types';
import { ReadError } from '@trg_package/errors';

export const readAll = async (
  req: Request<object, object, object, Partial<RoleSelect>>,
  res: Response<{ roles: RoleWithPermission[] }>,
  next: NextFunction
) => {
  try {
    const roles = (await req.services.role.findMany({
      ...req.query
    }).catch((e) => {
      if (e instanceof ReadError) return [];
      throw e;
    })) as RoleWithPermission[];
    return res.json({ roles });
  } catch (e) {
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, RoleInsert>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const role = await req.services.role.createOne({
      ...req.body,
      name: req.body.name.toUpperCase()
    });
    return res.json({
      role
    });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<RoleSelect, 'id'>, object, Partial<RoleSelect>>,
  res: Response<{ role: RoleSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const role = await req.services.role.updateOne({ id }, req.body);
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
    const { id } = req.params;
    const role = await req.services.role.deleteOne({ id });
    return res.json({
      role
    });
  } catch (e) {
    return next(e);
  }
};
