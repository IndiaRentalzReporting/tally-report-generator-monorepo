import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
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
  UserSelect,
  DetailedUser
} from '@trg_package/schemas-dashboard/types';
import { ColumnInsert } from '@trg_package/schemas-reporting/types';
import {
  ColumnService,
  TableService
} from '@trg_package/schemas-reporting/services';
import { createUrl, createClient } from '@/models';
import actions from '../models/dashboard/seed/Actions/data.json';
import modules from '../models/dashboard/seed/Modules/data.json';
import columns from '../models/dashboard/seed/Columns/data.json';
import superUserRole from '../models/dashboard/seed/Roles/data.json';
import * as dashboardSchemas from '../models/dashboard/schema';
import { migrateDashboardSchema } from '../models/dashboard/seed/migrate';

class DashboardService {
  private dashboardConnection: Sql<{}>;

  private dashboardClient: PostgresJsDatabase<typeof dashboardSchemas>;

  public URL: string;

  constructor({
    db_username,
    db_password,
    db_name
  }:{
    db_username: string
    db_password: string
    db_name: string
  }) {
    const DASHBOARD_PG_URL = createUrl({
      db_username,
      db_password,
      db_name
    });
    const { client, connection } = createClient(
      DASHBOARD_PG_URL,
      dashboardSchemas
    );
    this.dashboardClient = client;
    this.dashboardConnection = connection;
    this.URL = DASHBOARD_PG_URL;
  }

  public async migrateAndSeed(userData: UserInsert): Promise<UserSelect> {
    migrateDashboardSchema(this.URL);
    const admin = await this.dashboardClient.transaction(async (trx) => {
      /**
       * Do not change the order of the following
       * statements as it will cause the seeding to fail
       */
      const user = await this.seedAdmin(userData, trx);
      await this.seedAction(trx);
      await this.seedModules(trx);
      await this.seedTable(trx);
      await this.seedColumn(trx);
      return user;
    });
    await this.terminateConnection();
    return admin;
  }

  private async seedAction(trx: PostgresJsDatabase<typeof dashboardSchemas>) {
    const ASI = new ActionService(trx);
    for (const action of actions) {
      await ASI.createOne(action);
    }
  }

  private async seedModules(trx: PostgresJsDatabase<typeof dashboardSchemas>) {
    const MSI = new ModuleService(trx);
    for (const module of modules) {
      await MSI.createOne(module);
    }
  }

  private async seedAdmin(
    data: UserInsert,
    trx: PostgresJsDatabase<typeof dashboardSchemas>
  ): Promise<UserSelect> {
    const role_id = await this.seedRole(trx);
    const USI = new UserService(trx);
    const admin = await USI.createOne({ ...data, role_id });
    return admin;
  }

  private async seedRole(
    trx: PostgresJsDatabase<typeof dashboardSchemas>
  ): Promise<RoleSelect['id']> {
    const RSI = new RoleService(trx);
    const role = await RSI.createOne(superUserRole);
    return role.id;
  }

  private async seedTable(trx: PostgresJsDatabase<typeof dashboardSchemas>) {
    const TSI = new TableService(trx);
    await TSI.seed();
  }

  private async seedColumn(trx: PostgresJsDatabase<typeof dashboardSchemas>) {
    const CSI = new ColumnService(trx);
    const TSI = new TableService(trx);
    const tables = await TSI.findMany();

    type k = keyof typeof columns;
    for (const { id, name } of tables) {
      const columData = columns[name as k] ?? [];
      for (const column of columData) {
        await CSI.createOne({ ...(column as ColumnInsert), tableId: id });
      }
    }

    await CSI.updateForeignKeys();
  }

  public async terminateConnection() {
    await this.dashboardConnection.end();
  }

  public async findUser(data: Partial<UserSelect>): Promise<DetailedUser> {
    const USI = new UserService(this.dashboardClient);
    const user = await USI.findOne(data);
    return user;
  }

  public async createUser(data: UserInsert): Promise<UserSelect> {
    const USI = new UserService(this.dashboardClient);
    const admin = await USI.createOne(data);
    return admin;
  }

  public async updateUser(
    filterDate: Partial<UserSelect>,
    data: Partial<UserInsert>
  ): Promise<UserSelect> {
    const USI = new UserService(this.dashboardClient);
    const admin = await USI.updateOne(filterDate, data);
    return admin;
  }

  public async deleteUser(filterDate: Partial<UserSelect>): Promise<UserSelect> {
    const USI = new UserService(this.dashboardClient);
    const admin = await USI.deleteOne(filterDate);
    return admin;
  }
}

export default DashboardService;
