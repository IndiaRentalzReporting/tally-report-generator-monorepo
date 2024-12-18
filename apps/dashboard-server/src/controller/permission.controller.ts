import { Request, Response, NextFunction } from 'express';
import {
  PermissionSelect,
  PermissionInsert
} from '@trg_package/schemas-dashboard/types';
import { ReadError } from '@trg_package/errors';

export const readAll = async (
  req: Request<object,object,object, Partial<PermissionSelect>>,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const permissions = await req.services.permission.findMany({
      ...req.query
    }).catch((e) => {
      if (e instanceof ReadError) return [];
      throw e;
    });
    res.json({ permissions });
  } catch (e) {
    return next(e);
  }
};

export const createOne = async (
  req: Request<object, object, PermissionInsert>,
  res: Response<{ permission: PermissionSelect }>,
  next: NextFunction
) => {
  try {
    const { role_id, module_id } = req.body;
    const permission = await req.services.permission.createOne({
      module_id,
      role_id
    });
    res.json({ permission });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<PermissionSelect, 'id'>, object, Partial<PermissionSelect>>,
  res: Response<{ permission: PermissionSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role_id, module_id } = req.body;
    const permission = await req.services.permission.updateOne(
      { id },
      {
        module_id,
        role_id
      }
    );
    return res.json({
      permission
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<PermissionSelect, 'id'>, object>,
  res: Response<{ permission: PermissionSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const permission = await req.services.permission.deleteOne({ id });
    return res.json({
      permission
    });
  } catch (e) {
    return next(e);
  }
};
