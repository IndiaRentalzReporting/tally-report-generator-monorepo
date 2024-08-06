import { Request, Response, NextFunction } from 'express';
import {
  ModuleSelect,
  ActionSelect,
  RoleSelect,
  PermissionSelect,
  PermissionSchema
} from '../models/schema';
import BaseService from '../services/BaseService';
import db from '../models';
import PermissionService from '../services/PermissionService';
import ActionService from '../services/ActionService';

const permissionService = new BaseService(
  PermissionSchema,
  db.query.PermissionSchema
);

export const readAll = async (
  req: Request,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const permissions = await permissionService.findMany(
      {},
      {
        with: {
          module: {
            columns: {
              name: true,
              id: true
            }
          },
          permissionAction: {
            columns: {
              action_id: false,
              permission_id: false
            },
            with: {
              action: {
                columns: {
                  name: true,
                  id: true
                }
              }
            }
          },
          role: {
            columns: {
              name: true,
              id: true
            }
          }
        }
      }
    );
    res.json({ permissions });
  } catch (e) {
    console.error("Couldn't fetch permissions");
    return next(e);
  }
};

export const readAllOfRole = async (
  req: Request<{ role_id: string }>,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const permissions = await permissionService.findMany({
      role_id: req.params.role_id
    });
    res.json({ permissions });
  } catch (e) {
    console.error("Couldn't fetch permissions");
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
      const permission = await permissionService.createOne({
        module_id,
        role_id
      });
      action_ids.forEach(async (action_id) => {
        const _ = await ActionService.findOne({
          id: action_id
        });
        await PermissionService.assignAction({
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
    console.error("Couldn't assign permissions to a role");
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
        await permissionService.deleteOneById(permission_id);
        const permission = await permissionService.createOne({
          module_id,
          role_id
        });
        action_ids.forEach(async (action_id) => {
          const _ = await ActionService.findOne({
            id: action_id
          });
          await PermissionService.assignAction({
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
    console.error("Couldn't update permissions for a role");
    return next(e);
  }
};
