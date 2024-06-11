import { CustomError } from '../errors';
import db from '../models';
import { PermissionInsert, PermissionSchema } from '../models/schema';

class PermissionService {
  public static async createOne(data: PermissionInsert, role_id: string) {
    const [permission] = await db
      .insert(PermissionSchema)
      .values({ ...data, role_id })
      .returning();

    if (!permission) {
      throw new CustomError(
        'Database error: Permission returned as undefined',
        500
      );
    }
    return permission;
  }
}

export default PermissionService;
