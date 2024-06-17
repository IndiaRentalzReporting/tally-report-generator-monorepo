import { and, eq } from 'drizzle-orm';
import { CustomError } from '../errors';
import db from '../models';
import {
  ActionSelect,
  ModuleSelect,
  PermissionActionSelect,
  PermissionInsert,
  PermissionSchema,
  PermissionSelect
} from '../models/schema';
import PermissionActionService from './PermissionActionService';

class PermissionService {
  public static async createOne(
    data: Pick<PermissionInsert, 'module_id' | 'role_id'>
  ): Promise<PermissionSelect> {
    const [permission] = await db
      .insert(PermissionSchema)
      .values({ ...data })
      .returning();

    if (!permission) {
      throw new CustomError(
        'Database error: Permission returned as undefined',
        500
      );
    }
    return permission;
  }

  public static async findOne(
    data: Partial<PermissionSelect>
  ): Promise<PermissionSelect> {
    const keys = Object.keys(data) as Array<keyof Partial<PermissionSelect>>;
    const values = Object.keys(data) as Array<any>;

    const permission = await db.query.PermissionSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(PermissionSchema[key], values[index]))
      )
    });

    if (!permission) {
      throw new CustomError('Permission does not exists', 500);
    }

    return permission;
  }

  public static async assignAction(data: {
    permission_id: PermissionSelect['id'];
    action_id: ActionSelect['id'];
  }): Promise<PermissionActionSelect> {
    return PermissionActionService.createOne({ ...data });
  }

  public static async createOneAndAssign(data: {
    module_id: PermissionInsert['module_id'];
    action_id: ActionSelect['id'];
    role_id: PermissionInsert['role_id'];
  }): Promise<PermissionSelect> {
    const permission = await this.createOne({
      module_id: data.module_id,
      role_id: data.role_id
    });

    await this.assignAction({
      permission_id: permission.id,
      action_id: data.action_id
    });

    return permission;
  }
}

export default PermissionService;
