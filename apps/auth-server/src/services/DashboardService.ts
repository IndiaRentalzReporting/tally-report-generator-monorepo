import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import actions from '../models/dashboard/seed/Actions/data.json';
import modules from '../models/dashboard/seed/Modules/data.json';
import roles from '../models/dashboard/seed/Roles/data.json';
import * as dashboardSchema from '@trg_package/dashboard-schemas/schemas';
import { BadRequestError } from '@trg_package/errors';
import { migrateDashboardSchema } from '../models/dashboard/seed/migrate';
import { Sql } from 'postgres';
import {
  ActionService,
  ModuleService,
  RoleService,
  UserService
} from '@trg_package/dashboard-schemas/services';
import {
  UserInsert,
  RoleSelect,
  UserSelect
} from '@trg_package/dashboard-schemas/types';
import { createDashboardClient } from '@trg_package/express/models';

class DashboardService {
  private dashboardConnection: Sql<{}>;
  private dashboardClient: PostgresJsDatabase<typeof dashboardSchema>;
  public URL: string;

  constructor(db_username: string, db_password: string, db_name: string) {
    const { client, connection, DASHBOARD_PG_URL } = createDashboardClient({
      db_username,
      db_password,
      db_name
    });
    this.dashboardClient = client;
    this.dashboardConnection = connection;
    this.URL = DASHBOARD_PG_URL;
  }

  public async migrateAndSeed(userData: UserInsert) {
    migrateDashboardSchema(this.URL);
    await this.seedDatabase(userData);
  }

  private async seedDatabase(userData: UserInsert) {
    await this.createAdmin(userData);
    await this.seedAction();
    await this.seedModules();
    await this.terminateConnection();
  }

  private async seedAction() {
    const ASI = new ActionService(this.dashboardClient);
    for (const { name } of actions) {
      await ASI.createOne({ name, isReadonly: true });
    }
  }

  private async seedModules() {
    const MSI = new ModuleService(this.dashboardClient);
    for (const { name } of actions) {
      await MSI.createOne({ name, isReadonly: true });
    }
  }

  private async createAdmin(data: UserInsert): Promise<UserSelect> {
    const role_id = await this.seedRole();
    const USI = new UserService(this.dashboardClient);
    const admin = await USI.createOne({ ...data, role_id, isReadonly: true });
    return admin;
  }

  private async seedRole(): Promise<RoleSelect['id']> {
    const RSI = new RoleService(this.dashboardClient);
    const role = await RSI.createOne({ name: roles.name, isReadonly: true });
    return role.id;
  }

  private async terminateConnection() {
    await this.dashboardConnection.end();
  }
}

export default DashboardService;
