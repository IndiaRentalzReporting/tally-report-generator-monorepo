import {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService,
  ApiKeyService,
  PermissionActionService
} from '@trg_package/schemas-dashboard/services';
import { NotFoundError } from '@trg_package/errors';
import { NextFunction, Request, Response } from 'express';
import { CompanyService } from '@trg_package/schemas-tally/services';
import { ColumnService, ReportService, TableService } from '@trg_package/schemas-reporting/services';

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
  req.permissionActionService = new PermissionActionService(dashboardDb);
  req.apiKeyService = new ApiKeyService(dashboardDb);
  req.companyService = new CompanyService(dashboardDb as any);
  req.tableService = new TableService(dashboardDb as any);
  req.columnService = new ColumnService(dashboardDb as any);
  req.reportService = new ReportService(dashboardDb as any);
  next();
};
