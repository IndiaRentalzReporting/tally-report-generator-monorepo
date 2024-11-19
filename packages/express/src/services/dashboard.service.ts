import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Sql } from 'postgres';
import {
  UserService
} from '@trg_package/schemas-dashboard/services';
import {
  UserSelect,
  DetailedUser
} from '@trg_package/schemas-dashboard/types';

import { createClient } from '../models';
import * as dashboardSchemas from '../models/dashboard/schema';
import config from '../config';

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
    const DASHBOARD_PG_URL = DashboardService.createUrl({
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

  public async findUser(data: Partial<UserSelect>): Promise<DetailedUser> {
    const USI = new UserService(this.dashboardClient);
    const user = await USI.findOne(data);
    return user;
  }

  public async terminateConnection() {
    await this.dashboardConnection.end();
  }

  private static createUrl({
    db_username,
    db_password,
    db_name
  }: {
    db_username: string;
    db_password: string;
    db_name: string;
  }) {
    const { DASHBOARD_PG_HOST, DASHBOARD_PG_PORT } = config;
    return `postgresql://${db_username}:${db_password}@${DASHBOARD_PG_HOST}:${DASHBOARD_PG_PORT}/${db_name}`;
  }
}

export default DashboardService;
