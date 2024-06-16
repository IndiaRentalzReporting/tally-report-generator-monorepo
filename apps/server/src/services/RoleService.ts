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
  public static async getAll(): Promise<RoleSelect[]> {
    return db.query.RoleSchema.findMany({});
  }

  public static async createOne(roleData: RoleInsert): Promise<RoleSelect> {
    const [role] = await db.insert(RoleSchema).values(roleData).returning();

    if (!role) {
      throw new CustomError('Database error: Role returned as undefined', 500);
    }

    return role;
  }

  public static async assignPermission(
    permissions: {
      module_id: ModuleSelect['id'];
      action_id: ActionSelect['id'];
    },
    role_id: string
  ): Promise<PermissionSelect> {
    const permission = await PermissionService.createOne(
      { module_id: permissions.module_id },
      role_id
    );

    const action = await ActionService.findOne(permissions.action_id);

    await PermissionActionService.createOne(permission.id, action.id);

    return permission;
  }
}

export default RoleService;
