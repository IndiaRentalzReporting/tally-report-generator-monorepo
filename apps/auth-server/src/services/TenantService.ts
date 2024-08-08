import db from '../models';
import { TenantSchema } from '../models/schema';
import BaseService from './BaseService';
import crypto from 'crypto';

class TenantService extends BaseService<
  typeof TenantSchema,
  typeof db.query.TenantSchema
> {
  constructor() {
    super(TenantSchema, db.query.TenantSchema);
  }

  generateUniqueIdentifier(baseName: string) {
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    return `${baseName}_${randomSuffix}`;
  }

  generateSecurePassword(length = 32) {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  generateTenantDBCredentials(tenantName: string) {
    const baseName = tenantName.toLowerCase();
    const dbName = this.generateUniqueIdentifier(baseName);
    const dbUsername = this.generateUniqueIdentifier(baseName);
    const dbPassword = this.generateSecurePassword();
    return { dbName, dbUsername, dbPassword };
  }

  async createDatabase(tenantName: string) {
    // LOGIC FOR CREATING A NEW CHILD DATABASE
  }
}

const TSI = new TenantService();

export default TSI;
