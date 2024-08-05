import db from '../models';
import { RoleSchema } from '../models/schema';
import BaseService from './BaseService';

class RoleService extends BaseService<
  typeof RoleSchema,
  typeof db.query.RoleSchema
> {
  constructor() {
    super(RoleSchema, db.query.RoleSchema);
  }
}

const RSI = new RoleService();

export default RSI;
