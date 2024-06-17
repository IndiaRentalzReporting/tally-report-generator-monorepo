import { CustomError } from '../errors';
import db from '../models';
import {
  ModuleSelect,
  PermissionSelect,
  RoleInsert,
  RoleSchema,
  RoleSelect
} from '../models/schema';
import { ActionSelect } from '../models/schema/actions';
import PermissionService from './PermissionService';
import PermissionActionService from './PermissionActionService';
import ActionService from './ActionService';

class RoleService {
  public static async readAll(): Promise<RoleSelect[]> {
    return db.query.RoleSchema.findMany({});
  }

  public static async createOne(data: RoleInsert): Promise<RoleSelect> {
    const [role] = await db
      .insert(RoleSchema)
      .values({ ...data, name: data.name.toLowerCase() })
      .returning();

    if (!role) {
      throw new CustomError('Database error: Role returned as undefined', 500);
    }

    return role;
  }
}

export default RoleService;
