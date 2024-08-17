import db from '../models';
import { ActionSchema } from '../models/schema';
import * as dashboardSchemas from '../models/schema';
import { BaseService } from '@trg_package/base-service';

class ActionService extends BaseService<
  typeof dashboardSchemas,
  typeof ActionSchema,
  typeof db.query.ActionSchema
> {
  constructor() {
    super(db, ActionSchema, db.query.ActionSchema);
  }
}

const ASI = new ActionService();

export default ASI;
