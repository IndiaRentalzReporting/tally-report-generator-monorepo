import expressLoader from './loaders/express';
import config from './config';
import type { DetailedUser as AuthDetailedUser } from '@trg_package/auth-schemas/types';
import type { DetailedUser as DashDetailedUser } from '@trg_package/dashboard-schemas/types';
import * as dashboardSchemas from '@trg_package/dashboard-schemas/schemas';
import type {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService,
  ApiKeyService
} from '@trg_package/dashboard-schemas/services';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';

const { PORT, NODE_ENV } = config;

(async () => {
  const app = await expressLoader();
  try {
    app.listen(PORT, async () => {
      console.log(
        `${NODE_ENV?.toLocaleUpperCase()} Server Listening at PORT: ${PORT}`
      );
    });
  } catch (err) {
    console.error('Could not connect to the server');
  }
})();

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
      dashboardConnection: Sql<{}>;
    }
    interface User extends AuthDetailedUser, DashDetailedUser {}
  }
}
