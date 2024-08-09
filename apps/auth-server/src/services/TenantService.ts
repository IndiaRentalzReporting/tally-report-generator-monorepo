import postgres from 'postgres';
import db from '../models';
import { TenantInsert, TenantSchema, TenantSelect } from '../models/schema';
import BaseService from './BaseService';
import crypto from 'crypto';
import config from '../config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

class TenantService extends BaseService<
  typeof TenantSchema,
  typeof db.query.TenantSchema
> {
  constructor() {
    super(TenantSchema, db.query.TenantSchema);
  }

  async createOne(data: TenantInsert): Promise<TenantSelect> {
    const tenant = await super.createOne(data);
    this.createDatabase(tenant.name);
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
    const dbName = this.generateUniqueIdentifier(baseName);
    const dbUsername = this.generateUniqueIdentifier(baseName);
    const dbPassword = this.generateSecurePassword();
    return { dbName, dbUsername, dbPassword };
  }

  private async createDatabase(tenantName: TenantInsert['name']) {
    const { SUPERUSER_PG_URL } = config;

    const client = postgres(SUPERUSER_PG_URL, {
      max: 1
    });

    const { dbName, dbUsername, dbPassword } =
      this.generateTenantDBCredentials(tenantName);

    const db = drizzle(client);

    await db.execute(
      sql`CREATE USER ${dbUsername} WITH PASSWORD '${dbPassword}'`
    );
    await db.execute(sql`CREATE DATABASE ${dbName} OWNER ${dbUsername}`);
    await db.execute(
      sql`GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${dbUsername}`
    );

    return { dbName, dbUsername, dbPassword };
  }
}

const TSI = new TenantService();

export default TSI;
