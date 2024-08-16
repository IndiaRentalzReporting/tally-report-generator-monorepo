import postgres from 'postgres';
import db from '../models/auth';
import {
  TenantInsert,
  TenantSchema,
  TenantSelect
} from '../models/auth/schema';
import { BaseService } from '@trg_package/base-schemas/services';
import * as authschemas from '../models/auth/schema';
import DashboardService from './DashboardService';
import crypto from 'crypto';
import config from '../config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as dashboardSchema from '@trg_package/dashboard-schemas/schemas';

class TenantService extends BaseService<
  typeof authschemas,
  typeof TenantSchema,
  typeof db.query.TenantSchema
> {
  constructor() {
    super(db, TenantSchema, db.query.TenantSchema);
  }

  async onboard(
    tenantData: TenantInsert,
    userData: dashboardSchema.UserInsert
  ): Promise<TenantSelect> {
    const { db_name, db_username, db_password } = await this.createDatabase(
      tenantData.name
    );

    const DSI = new DashboardService(db_username, db_password, db_name);
    await DSI.migrateAndSeed(userData);

    const tenant = await super.createOne({
      ...tenantData,
      db_name,
      db_username,
      db_password
    });

    return tenant;
  }

  private generateUniqueIdentifier(baseName: string) {
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    return `${baseName}_${randomSuffix}`;
  }

  private generateSecurePassword(length = 32) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  private generateTenantDBCredentials(tenantName: string) {
    const baseName = tenantName.toLowerCase();
    const db_name = this.generateUniqueIdentifier(baseName);
    const db_username = this.generateUniqueIdentifier(baseName);
    const db_password = this.generateSecurePassword();
    return { db_name, db_username, db_password };
  }

  private async createDatabase(tenantName: TenantInsert['name']): Promise<{
    db_name: string;
    db_username: string;
    db_password: string;
  }> {
    const { SUPERUSER_PG_URL } = config;

    const { db_name, db_username, db_password } =
      this.generateTenantDBCredentials(tenantName);

    try {
      const client = postgres(SUPERUSER_PG_URL, {
        max: 1
      });

      const db = drizzle(client);

      await db.execute(
        sql`CREATE USER ${sql.identifier(db_username)} WITH PASSWORD ${sql.raw(`'${db_password}'`)}`
      );

      await db.execute(
        sql`CREATE DATABASE ${sql.identifier(db_name)} OWNER ${sql.identifier(db_username)}`
      );

      await db.execute(
        sql`GRANT ALL PRIVILEGES ON DATABASE ${sql.identifier(db_name)} TO ${sql.identifier(db_username)}`
      );
    } catch (e) {
      throw new Error(`Could not create database: ${e}`);
    }

    return { db_name, db_username, db_password };
  }
}

const TSI = new TenantService();

export default TSI;
