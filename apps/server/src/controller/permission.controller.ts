import { Request, Response, NextFunction } from 'express';
import {
  ModuleSelect,
  ActionSelect,
  RoleSelect,
  PermissionSelect
} from '../models/schema';
import PermissionService from '../services/PermissionService';
import ActionService from '../services/ActionService';

export const createMany = async (
  req: Request<
    object,
    object,
    {
      permissions: {
        module_id: ModuleSelect['id'];
        action_id: ActionSelect['id'];
      }[];
      role_id: RoleSelect['id'];
    }
  >,
  res: Response<{ permissions: PermissionSelect[] }>,
  next: NextFunction
) => {
  try {
    const { role_id, permissions } = req.body;
    const promises = permissions.map(async ({ module_id, action_id }) => {
      const _ = await ActionService.findOne({
        id: action_id
      });

      return PermissionService.createOneAndAssign({
        module_id,
        action_id,
        role_id
      });
    });
    res.json({
      permissions: await Promise.all(promises)
    });
  } catch (e) {
    console.error("Couldn't assign permissions to a role");
    next(e);
  }
};
