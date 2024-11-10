import { Request, Response, NextFunction } from 'express';
import {
  PermissionActionSelect,
  PermissionActionInsert
} from '@trg_package/schemas-dashboard/types';

export const createOne = async (
  req: Request<object, object, PermissionActionInsert>,
  res: Response<{ permissionAction: PermissionActionSelect }>,
  next: NextFunction
) => {
  try {
    const { action_id, permission_id } = req.body;
    const permissionAction = await req.dashboard.services.permissionAction.createOne({
      action_id,
      permission_id
    });
    res.json({ permissionAction });
  } catch (e) {
    return next(e);
  }
};

export const readAll = async (
  req: Request<object, object, object, Partial<PermissionActionSelect>>,
  res: Response<{ permissionActions: PermissionActionSelect[] }>,
  next: NextFunction
) => {
  try {
    const permissionActions = await req.dashboard.services.permissionAction.findMany({
      ...req.query,
      isPrivate: false
    });
    res.json({ permissionActions });
  } catch (e) {
    return next(e);
  }
};

export const updateOne = async (
  req: Request<
  Pick<PermissionActionSelect, 'action_id' | 'permission_id'>,
  object,
  Partial<PermissionActionSelect>
  >,
  res: Response<{ permissionAction: PermissionActionSelect }>,
  next: NextFunction
) => {
  try {
    const { action_id: oldActionId, permission_id: oldPermissionId } = req.params;
    const { action_id, permission_id } = req.body;
    const permissionAction = await req.dashboard.services.permissionAction.updateOne(
      { action_id: oldActionId, permission_id: oldPermissionId },
      {
        action_id,
        permission_id
      }
    );
    return res.json({
      permissionAction
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteOne = async (
  req: Request<Pick<PermissionActionSelect, 'action_id' | 'permission_id'>>,
  res: Response<{ permission: PermissionActionSelect }>,
  next: NextFunction
) => {
  try {
    const { action_id, permission_id } = req.params;
    const permission = await req.dashboard.services.permissionAction.deleteOne({
      action_id,
      permission_id
    });
    return res.json({ permission });
  } catch (e) {
    return next(e);
  }
};
