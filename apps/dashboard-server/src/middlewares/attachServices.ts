import {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService
} from '@trg_package/dashboard-schemas/services';
import { NotFoundError } from '@trg_package/errors';
import { NextFunction, Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      userService: UserService;
      roleService: RoleService;
      moduleService: ModuleService;
      actionService: ActionService;
      permissionService: PermissionService;
    }
  }
}

export const attachServices = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { dashboardDb } = req;
  if (!dashboardDb)
    throw new NotFoundError('Dashboard database client not found');
  req.userService = new UserService(dashboardDb);
  req.roleService = new RoleService(dashboardDb);
  req.moduleService = new ModuleService(dashboardDb);
  req.actionService = new ActionService(dashboardDb);
  req.permissionService = new PermissionService(dashboardDb);
  next();
};
