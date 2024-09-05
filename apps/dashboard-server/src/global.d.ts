import { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';
import * as dashboardSchemas from '@trg_package/dashboard-schemas/schemas';
import {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService,
  ApiKeyService
} from '@trg_package/dashboard-schemas/services';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

declare global {
  namespace Express {
    interface Request {
      module?: string;
      action?: string;
      userService: UserService;
      roleService: RoleService;
      moduleService: ModuleService;
      actionService: ActionService;
      permissionService: PermissionService;
      apiKeyService: ApiKeyService;
      dashboardDb: PostgresJsDatabase<typeof dashboardSchemas>;
      dashboardConnection: postgres.Sql<{}>;
    }
    interface User extends AuthDetailedUser, DashDetailedUser {}
  }
}
