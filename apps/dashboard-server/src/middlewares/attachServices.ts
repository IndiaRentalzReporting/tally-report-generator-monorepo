import {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService,
  ApiKeyService
} from '@trg_package/schemas-dashboard/services';
import { NotFoundError } from '@trg_package/errors';
import { NextFunction, Request, Response } from 'express';

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
  req.apiKeyService = new ApiKeyService(dashboardDb);
  next();
};
