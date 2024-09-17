import postgres from 'postgres';
import db from '../models/auth';
import { TenantInsert, TenantSelect } from '@trg_package/schemas-auth/types';
import {
  UserInsert as DashboardUserInsert,
  UserSelect
} from '@trg_package/schemas-dashboard/types';
import { TenantService as BaseTenantService } from '@trg_package/schemas-auth/services';
import DashboardService from './DashboardService';
import crypto from 'crypto';
import config from '../config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { DatabaseError } from '@trg_package/errors';

class TenantService extends BaseTenantService {
  constructor() {
    super(db);
  }

  async onboard(
    tenantData: TenantInsert,
    userData: DashboardUserInsert
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
    const randomSuffix = crypto
      .randomBytes(4)
      .toString('hex')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    return `${baseName}_${randomSuffix}`;
  }

  private generateSecurePassword(length = 32) {
    return crypto
      .randomBytes(length)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  }

  private generateTenantDBCredentials(tenantName: string) {
    const baseName = tenantName.toLowerCase().replace(/ /g, '_');
    const db_name = this.generateUniqueIdentifier(baseName);
    const db_username = this.generateUniqueIdentifier(baseName);
    const db_password = this.generateSecurePassword();
    return { db_name, db_username, db_password };
  }

  private async createDatabase(tenantName: TenantInsert['name']): Promise<{
    db_name: NonNullable<TenantSelect['db_name']>;
    db_username: NonNullable<TenantSelect['db_username']>;
    db_password: NonNullable<TenantSelect['db_password']>;
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
      throw new DatabaseError(`Could not create dashboard database: ${e}`);
    }

    return { db_name, db_username, db_password };
  }
}

const TSI = new TenantService();

export default TSI;
