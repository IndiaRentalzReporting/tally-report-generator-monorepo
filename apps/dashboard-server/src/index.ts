import expressLoader from './loaders/express';
import config from './config';
import * as dashboardSchemas from './models/schemas';
import type {
  UserService,
  RoleService,
  ModuleService,
  ActionService,
  PermissionService,
  ApiKeyService,
  PermissionActionService,
  UserTallyCompanyService
} from '@trg_package/schemas-dashboard/services';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import type { Sql } from 'postgres';
import { CompanyService } from '@trg_package/schemas-tally/services';
import { ColumnService, ReportService, TableService } from '@trg_package/schemas-reporting/services';

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
      permissionActionService: PermissionActionService;
      userTallyCompanyService: UserTallyCompanyService;
      apiKeyService: ApiKeyService;
      companyService: CompanyService;
      tableService : TableService;
      columnService :ColumnService;
      reportService : ReportService;

      dashboardDb: PostgresJsDatabase<typeof dashboardSchemas> | null;
      dashboardConnection: Sql<{}> | null;
    }
  }
}
