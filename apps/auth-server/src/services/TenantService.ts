import db from '../models';
import { TenantSchema } from '../models/schema';
import BaseService from './BaseService';

class TenantService extends BaseService<
  typeof TenantSchema,
  typeof db.query.TenantSchema
> {
  constructor() {
    super(TenantSchema, db.query.TenantSchema);
  }
}

const TSI = new TenantService();

export default TSI;
