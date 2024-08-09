import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { createClient } from '../models';
import actions from '../models/seed/Actions/data.json';
import modules from '../models/seed/Modules/data.json';
import roles from '../models/seed/Roles/data.json';
import * as dashboardSchema from '@fullstack-package/dashboard-schemas';
import { BadRequestError } from '../errors';
import { eq } from 'drizzle-orm';

class DashboardService {
  private dashboardClient: PostgresJsDatabase<typeof dashboardSchema>;

  constructor(db_username: string, db_password: string, db_name: string) {
    const URL = DashboardService.createUrl(
      db_username!,
      db_password!,
      db_name!
    );
    this.dashboardClient = createClient(URL, dashboardSchema).db;
  }

  public static createUrl(user: string, password: string, name: string) {
    return `postgresql://${user}:${password}@$localhost:5432/${name}`;
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
        return this.dashboardClient
          .insert(dashboardSchema.ActionSchema)
          .values({ name })
          .returning();
      } catch (error) {
        throw new BadRequestError(`Could not create action ${name}`);
      }
    });
    await Promise.all(promises);
  }

  public async seedModules() {
    const promises = modules.map(async ({ name }) => {
      try {
        return this.dashboardClient
          .insert(dashboardSchema.ModuleSchema)
          .values({ name })
          .returning();
      } catch (error) {
        throw new BadRequestError(`Could not create module ${name}`);
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
}

export default DashboardService;
