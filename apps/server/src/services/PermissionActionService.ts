import { CustomError } from '../errors';
import { db } from '../models';
import {
  PermissionActionSchema,
  PermissionActionSelect
} from '../models/schema';

class PermissionActionService {
  public static async createOne(
    permission_id: string,
    action_id: string
  ): Promise<PermissionActionSelect> {
    const [permissionAction] = await db
      .insert(PermissionActionSchema)
      .values({
        permission_id,
        action_id
      })
      .returning();

    if (!permissionAction) {
      throw new CustomError(
        'Database error: PermissionAction returned as undefined',
        500
      );
    }
    return permissionAction;
  }
}

export default PermissionActionService;
