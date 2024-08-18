import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import actions from '../models/dashboard/seed/Actions/data.json';
import modules from '../models/dashboard/seed/Modules/data.json';
import roles from '../models/dashboard/seed/Roles/data.json';
import * as dashboardSchema from '@trg_package/dashboard-schemas/schemas';
import { BaseService } from '@trg_package/base-service';
import { BadRequestError } from '@trg_package/errors';
import { migrateDashboardSchema } from '../models/dashboard/seed/migrate';
import { Sql } from 'postgres';
import config from '../config';
import { UserSchema as DashboardUserSchema } from '@trg_package/dashboard-schemas/schemas';
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
    this.URL = this.createUrl(db_username, db_password, db_name);
    const { db, connection } = BaseService.createClient(
      this.URL,
      dashboardSchema,
      {
        DB_MIGRATING,
        DB_SEEDING
      }
    );
    this.dashboardClient = db;
    this.dashboardConnection = connection;
    this.migrateAndSeed();
  }

  private createUrl(user: string, password: string, name: string) {
    return `postgresql://${user}:${password}@localhost:5432/${name}`;
  }

  private async migrateAndSeed() {
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
      return;
    });
  }

  public async seedDatabase(userData: UserInsert): Promise<UserSelect> {
    await this.seedAction();
    await this.seedModules();
    const user = await this.createAdmin(userData);
    await this.terminateConnection();
    return user;
  }

  private async seedRole(): Promise<RoleSelect['id']> {
    const [role] = await this.dashboardClient
      .insert(dashboardSchema.RoleSchema)
      .values({ name: roles.name })
      .returning();

    if (!role) throw new BadRequestError('Could not create role');
    return role.id;
  }

  private async seedAction() {
    const promises = actions.map(async ({ name }) => {
      try {
        return await this.dashboardClient
          .insert(dashboardSchema.ActionSchema)
          .values({ name })
          .returning();
      } catch (error) {
        throw new BadRequestError(`Could not create action ${name}: ${error}`);
      }
    });
    await Promise.all(promises);
  }

  private async seedModules() {
    const promises = modules.map(async ({ name }) => {
      try {
        return await this.dashboardClient
          .insert(dashboardSchema.ModuleSchema)
          .values({ name })
          .returning();
      } catch (error) {
        throw new BadRequestError(`Could not create module ${name}: ${error}`);
      }
    });
    await Promise.all(promises);
  }

  private async createAdmin(data: UserInsert): Promise<UserSelect> {
    const role_id = await this.seedRole();
    const [admin] = await this.dashboardClient
      .insert(DashboardUserSchema)
      .values({ ...data, role_id })
      .returning();

    if (!admin) throw new BadRequestError('Could not create admin');
    return admin;
  }

  private async terminateConnection() {
    await this.dashboardConnection.end();
  }
}

export default DashboardService;
