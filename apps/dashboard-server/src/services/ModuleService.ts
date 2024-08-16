import db from '../models';
import { ModuleSchema } from '../models/schema';
import * as dashboardSchemas from '../models/schema';
import { BaseService } from '@trg_package/base-schemas/services';

class ModuleService extends BaseService<
  typeof dashboardSchemas,
  typeof ModuleSchema,
  typeof db.query.ModuleSchema
> {
  constructor() {
    super(db, ModuleSchema, db.query.ModuleSchema);
  }
}

const MSI = new ModuleService();

export default MSI;
