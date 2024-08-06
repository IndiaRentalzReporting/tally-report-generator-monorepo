import db from '../models';
import { PermissionActionSchema } from '../models/schema';
import BaseService from './BaseService';

class PermissionActionService extends BaseService<
  typeof PermissionActionSchema,
  typeof db.query.PermissionActionSchema
> {
  constructor() {
    super(PermissionActionSchema, db.query.PermissionActionSchema);
  }
}

const PSAI = new PermissionActionService();

export default PSAI;
