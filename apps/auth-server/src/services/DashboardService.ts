import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import actions from '../models/dashboard/seed/Actions/data.json';
import modules from '../models/dashboard/seed/Modules/data.json';
import roles from '../models/dashboard/seed/Roles/data.json';
import * as dashboardSchema from '@trg_package/dashboard-schemas/schemas';
import { BaseServiceNew } from '@trg_package/base-service';
import { BadRequestError } from '@trg_package/errors';
import { migrateDashboardSchema } from '../models/dashboard/seed/migrate';
import { Sql } from 'postgres';
import config from '../config';
import { UserSchema as DashboardUserSchema } from '@trg_package/dashboard-schemas/schemas';
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

class DashboardService {
  private dashboardConnection: Sql<{}>;
  private dashboardClient: PostgresJsDatabase<typeof dashboardSchema>;
  public URL: string;

  constructor(db_username: string, db_password: string, db_name: string) {
    const { DB_MIGRATING, DB_SEEDING } = config;
    this.URL = BaseServiceNew.createUrl({ db_username, db_password, db_name });
    const { client, connection } = BaseServiceNew.createClient(
      this.URL,
      dashboardSchema,
      {
        DB_MIGRATING,
        DB_SEEDING
      }
    );
    this.dashboardClient = client;
    this.dashboardConnection = connection;
  }

  public async migrateAndSeed(userData: UserInsert) {
    migrateDashboardSchema(this.URL, async (error, stdout, stderr) => {
      if (error) {
        console.error(`Migration Error: ${error.message}`);
        throw new BadRequestError(`Could not migrate schema: ${error}`);
      }
      if (stderr) {
        console.error(`Migration Stderr: ${stderr}`);
        throw new Error(`Migration Stderr: ${stderr}`);
      }
      console.log(`Migration Stdout: ${stdout}`);
      await this.seedDatabase(userData);
      return;
    });
  }

  private async seedDatabase(userData: UserInsert) {
    await this.seedAction();
    await this.seedModules();
    await this.createAdmin(userData);
    await this.terminateConnection();
  }

  private async seedAction() {
    const ASI = new ActionService(this.dashboardClient);
    const promises = actions.map(
      async ({ name }) => await ASI.createOne({ name })
    );

    await Promise.all(promises);
  }

  private async seedModules() {
    const MSI = new ModuleService(this.dashboardClient);
    const promises = modules.map(
      async ({ name }) => await MSI.createOne({ name })
    );
    await Promise.all(promises);
  }

  private async createAdmin(data: UserInsert): Promise<UserSelect> {
    const USI = new UserService(this.dashboardClient);
    const role_id = await this.seedRole();
    const admin = await USI.createOne({ ...data, role_id });
    return admin;
  }

  private async seedRole(): Promise<RoleSelect['id']> {
    const RSI = new RoleService(this.dashboardClient);
    const role = await RSI.createOne({ name: roles.name });
    return role.id;
  }

  private async terminateConnection() {
    await this.dashboardConnection.end();
  }
}

export default DashboardService;
