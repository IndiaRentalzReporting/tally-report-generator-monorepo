import { Request, Response, NextFunction } from 'express';
import {
  ModuleSelect,
  ActionSelect,
  RoleSelect,
  PermissionSelect
} from '@trg_package/schemas-dashboard/types';

export const readAll = async (
  req: Request,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const permissions = await req.permissionService.findMany({});
    res.json({ permissions });
  } catch (e) {
    return next(e);
  }
};

export const readAllOfRole = async (
  req: Request<{ role_id: string }>,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const permissions = await req.permissionService.findMany({
      role_id: req.params.role_id
    });
    res.json({ permissions });
  } catch (e) {
    return next(e);
  }
};

export const createMany = async (
  req: Request<
    object,
    object,
    {
      permissions: {
        module_id: ModuleSelect['id'];
        action_ids: ActionSelect['id'][];
      }[];
      role_id: RoleSelect['id'];
    }
  >,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const { role_id, permissions } = req.body;
    const promises = permissions.map(async ({ module_id, action_ids }) => {
      const permission = await req.permissionService.createOne({
        module_id,
        role_id
      });
      action_ids.forEach(async (action_id) => {
        const _ = await req.actionService.findOne({
          id: action_id
        });
        await req.permissionService.assignAction({
          permission_id: permission.id,
          action_id
        });
      });
      return permission;
    });
    return res.json({
      permissions: await Promise.all(promises)
    });
  } catch (e) {
    return next(e);
  }
};

export const updateMany = async (
  req: Request<
    object,
    object,
    {
      permissions: {
        permission_id: PermissionSelect['id'];
        module_id: ModuleSelect['id'];
        action_ids: ActionSelect['id'][];
      }[];
      role_id: RoleSelect['id'];
    }
  >,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const { role_id, permissions } = req.body;
    const promises = permissions.map(
      async ({ permission_id, module_id, action_ids }) => {
        await req.permissionService.deleteOne(permission_id);
        const permission = await req.permissionService.createOne({
          module_id,
          role_id
        });
        action_ids.forEach(async (action_id) => {
          const _ = await req.actionService.findOne({
            id: action_id
          });
          await req.permissionService.assignAction({
            permission_id: permission.id,
            action_id
          });
        });
        return permission;
      }
    );
    return res.json({
      permissions: await Promise.all(promises)
    });
  } catch (e) {
    return next(e);
  }
};
