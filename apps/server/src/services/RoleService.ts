import { CustomError } from '../errors';
import db from '../models';
import {
  PermissionInsert,
  PermissionSelect,
  RoleInsert,
  RoleSchema,
  RoleSelect
} from '../models/schema';
import { ActionInsert } from '../models/schema/action';
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

  public static async assignPermissions(
    permissions: (PermissionInsert & Pick<ActionInsert, 'name'>)[],
    role_id: string
  ): Promise<PermissionSelect[]> {
    const queries = permissions.map(async (permissionData) => {
      const { name: actionName, ...pData } = permissionData;

      const permission = await PermissionService.createOne(pData, role_id);

      const action = await ActionService.findOne(actionName);

      await PermissionActionService.createOne(permission.id, action.id);

      return permission;
    });

    return Promise.all(queries);
  }
}

export default RoleService;
