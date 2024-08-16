import db from '../models';
import * as dashboardSchemas from '../models/schema';
import { RoleSchema } from '../models/schema';
import { BaseService } from '@trg_package/base-schemas/services';

class RoleService extends BaseService<
  typeof dashboardSchemas,
  typeof RoleSchema,
  typeof db.query.RoleSchema
> {
  constructor() {
    super(db, RoleSchema, db.query.RoleSchema);
  }
}

const RSI = new RoleService();

export default RSI;
