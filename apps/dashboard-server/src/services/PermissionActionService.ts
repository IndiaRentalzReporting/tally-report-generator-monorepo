import db from '../models';
import * as dashboardSchemas from '../models/schema';
import { PermissionActionSchema } from '../models/schema';
import { BaseService } from '@trg_package/base-service';

class PermissionActionService extends BaseService<
  typeof dashboardSchemas,
  typeof PermissionActionSchema,
  typeof db.query.PermissionActionSchema
> {
  constructor() {
    super(db, PermissionActionSchema, db.query.PermissionActionSchema);
  }
}

const PSAI = new PermissionActionService();

export default PSAI;
