import { and, eq } from 'drizzle-orm';
import { CustomError, NotFoundError } from '../errors';
import db from '../models';
import {
  ActionSelect,
  PermissionActionSchema,
  PermissionActionSelect,
  PermissionSelect
} from '../models/schema';

class PermissionActionService {
  public static async createOne(data: {
    permission_id: PermissionSelect['id'];
    action_id: ActionSelect['id'];
  }): Promise<PermissionActionSelect> {
    const [permissionAction] = await db
      .insert(PermissionActionSchema)
      .values({ ...data })
      .returning();

    if (!permissionAction) {
      throw new CustomError(
        'Database error: PermissionAction returned as undefined',
        500
      );
    }
    return permissionAction;
  }

  public static async findOne(
    data: Partial<PermissionActionSelect>
  ): Promise<PermissionActionSelect> {
    const keys = Object.keys(data) as Array<
      keyof Partial<PermissionActionSelect>
    >;
    const values = Object.values(data) as Array<any>;
    const permission = await db.query.PermissionActionSchema.findFirst({
      where: and(
        ...keys.map((key, index) =>
          eq(PermissionActionSchema[key], values[index])
        )
      )
    });

    if (!permission) {
      throw new NotFoundError('No Permission Action combination!');
    }

    return permission;
  }
}

export default PermissionActionService;
