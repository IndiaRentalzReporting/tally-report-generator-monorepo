import postgres from 'postgres';
import db from '../models/auth';
import {
  TenantInsert,
  TenantSchema,
  TenantSelect
} from '../models/auth/schema';
import BaseService from './BaseService';
import crypto from 'crypto';
import config from '../config';
import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import * as dashboardSchema from '@fullstack-package/dashboard-schemas';
import { sql } from 'drizzle-orm';
import actions from '../models/dashboard/seed/Actions/data.json';

class TenantService extends BaseService<
  typeof TenantSchema,
  typeof db.query.TenantSchema
> {
  constructor() {
    super(TenantSchema, db.query.TenantSchema);
  }

  async createOne(data: TenantInsert): Promise<TenantSelect> {
    const { db_name, db_username, db_password } = await this.createDatabase(
      data.name
    );
    const tenant = await super.createOne({
      ...data,
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
