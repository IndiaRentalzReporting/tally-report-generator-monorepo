import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import actions from '../models/dashboard/seed/Actions/data.json';
import modules from '../models/dashboard/seed/Modules/data.json';
import superUserRole from '../models/dashboard/seed/Roles/data.json';
import * as dashboardSchema from '@trg_package/schemas-dashboard/schemas';
import { migrateDashboardSchema } from '../models/dashboard/seed/migrate';
import { Sql } from 'postgres';
import {
  ActionService,
  ModuleService,
  RoleService,
  UserService
} from '@trg_package/schemas-dashboard/services';
import {
  UserInsert,
  RoleSelect,
  UserSelect
} from '@trg_package/schemas-dashboard/types';
import { createUrl, createClient } from '@trg_package/pg-client';

class DashboardService {
  private dashboardConnection: Sql<{}>;
  private dashboardClient: PostgresJsDatabase<typeof dashboardSchema>;
  public URL: string;

  constructor(db_username: string, db_password: string, db_name: string) {
    const DASHBOARD_PG_URL = createUrl({
      db_username,
      db_password,
      db_name
    });
    const { client, connection } = createClient(
      DASHBOARD_PG_URL,
      dashboardSchema,
      {
        DB_MIGRATING: true,
        DB_SEEDING: true
      }
    );
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
    for (const action of actions) {
      await ASI.createOne(action);
    }
  }

  private async seedModules() {
    const MSI = new ModuleService(this.dashboardClient);
    for (const module of modules) {
      await MSI.createOne(module);
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
    const role = await RSI.createOne(superUserRole);
    return role.id;
  }

  private async terminateConnection() {
    await this.dashboardConnection.end();
  }
}

export default DashboardService;
