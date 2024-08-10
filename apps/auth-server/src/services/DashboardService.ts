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
    console.log(this.URL);
    const { db, connection } = createClient(this.URL, dashboardSchema);
    this.dashboardClient = db;
    this.dashboardConnection = connection;
  }

  public createUrl(user: string, password: string, name: string) {
    return `postgresql://${user}:${password}@localhost:5432/${name}`;
  }

  public async migrateSchema() {
    migrateDashboardSchema(this.URL);
  }

  public async seedDatabase() {
    await this.seedAction();
    await this.seedModules();
  }

  public async seedRole() {
    const [role] = await this.dashboardClient
      .insert(dashboardSchema.RoleSchema)
      .values({ name: roles.name })
      .returning();

    if (!role) throw new BadRequestError('Could not create role');
  }

  public async seedAction() {
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

  public async seedModules() {
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

  public async seedAdmin(data: dashboardSchema.UserInsert, role_id: string) {
    const [admin] = await this.dashboardClient
      .insert(dashboardSchema.UserSchema)
      .values({ ...data, role_id })
      .returning();

    if (!admin) throw new BadRequestError('Could not create admin');
  }

  public async terminateConnection() {
    await this.dashboardConnection.end();
  }
}

export default DashboardService;
