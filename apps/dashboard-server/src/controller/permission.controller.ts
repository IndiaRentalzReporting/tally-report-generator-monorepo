import { Request, Response, NextFunction } from 'express';
import {
  PermissionSelect,
  PermissionInsert
} from '@trg_package/schemas-dashboard/types';

export const readAll = async (
  req: Request<object, Partial<PermissionSelect>>,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const permissions = await req.permissionService.findMany({
      ...req.query
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
    const permission = await req.permissionService.createOne({
      module_id,
      role_id
    });
    res.json({ permission });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<Pick<PermissionSelect, 'id'>, object, PermissionSelect>,
  res: Response<{ permission: PermissionSelect }>,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { role_id, module_id } = req.body;
    const permission = await req.permissionService.updateOne(id, {
      module_id,
      role_id
    });
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
    const permission = await req.permissionService.deleteOne(id);
    return res.json({
      permission
    });
  } catch (e) {
    return next(e);
  }
};
