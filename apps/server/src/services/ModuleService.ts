import db from '../models';
import { ModuleSchema } from '../models/schema';
import BaseService from './BaseService';

class ModuleService extends BaseService<
  typeof ModuleSchema,
  typeof db.query.ModuleSchema
> {
  constructor() {
    super(ModuleSchema, db.query.ModuleSchema);
  }
}

const MSI = new ModuleService();

export default MSI;
