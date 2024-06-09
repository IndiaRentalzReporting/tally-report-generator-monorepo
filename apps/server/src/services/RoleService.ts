import { CustomError } from '../errors';
import { db } from '../models';
import {
  PermissionInsert,
  PermissionRoleSchema,
  PermissionSchema,
  PermissionSelect,
  RoleInsert,
  RoleSchema,
  RoleSelect,
  UserRoleSchema,
  UserRoleSelect
} from '../models/schema';

class RoleService {
  public static async createOne(roleData: RoleInsert): Promise<RoleSelect> {
    const [role] = await db.insert(RoleSchema).values(roleData).returning();

    if (!role) {
      throw new CustomError('Database error: Role returned as undefined', 500);
    }

    return role;
  }

  public static async assignPermissions(
    permissions: PermissionInsert,
    roleId: string
  ): Promise<PermissionSelect> {
    const [permission] = await db
      .insert(PermissionSchema)
      .values(permissions)
      .returning();

    if (!permission) {
      throw new CustomError(
        'Database error: Permission returned as undefined',
        500
      );
    }

    await db.insert(PermissionRoleSchema).values({
      permission_id: permission.id,
      role_id: roleId
    });

    return permission;
  }
}

export default RoleService;
