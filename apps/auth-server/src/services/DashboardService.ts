import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createClient } from '../models';
import actions from '../models/dashboard/seed/Actions/data.json';
import modules from '../models/dashboard/seed/Modules/data.json';
import roles from '../models/dashboard/seed/Roles/data.json';
import * as dashboardSchema from '@fullstack-package/dashboard-schemas';
import { BadRequestError } from '../errors';
import { migrateDashboardSchema } from '../models/dashboard/seed/migrate';
import postgres from 'postgres';

class DashboardService {
  private dashboardConnection: postgres.Sql<{}>;
  private dashboardClient: PostgresJsDatabase<typeof dashboardSchema>;
  public URL: string;

  constructor(db_username: string, db_password: string, db_name: string) {
    this.URL = this.createUrl(db_username, db_password, db_name);
    const { db, connection } = createClient(this.URL, dashboardSchema);
    this.dashboardClient = db;
    this.dashboardConnection = connection;
  }

  private createUrl(user: string, password: string, name: string) {
    return `postgresql://${user}:${password}@localhost:5432/${name}`;
  }

  public async migrateAndSeed() {
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
      await this.seedDatabase();
      return;
    });
  }

  private async seedDatabase() {
    await this.seedAction();
    await this.seedModules();
    await this.terminateConnection();
  }

  private async seedRole() {
    const [role] = await this.dashboardClient
      .insert(dashboardSchema.RoleSchema)
      .values({ name: roles.name })
      .returning();

    if (!role) throw new BadRequestError('Could not create role');
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

  private async seedAdmin(data: dashboardSchema.UserInsert, role_id: string) {
    const [admin] = await this.dashboardClient
      .insert(dashboardSchema.UserSchema)
      .values({ ...data, role_id })
      .returning();

    if (!admin) throw new BadRequestError('Could not create admin');
  }

  private async terminateConnection() {
    await this.dashboardConnection.end();
  }
}

export default DashboardService;
