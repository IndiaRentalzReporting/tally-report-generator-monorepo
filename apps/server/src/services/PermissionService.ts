import { and, eq } from 'drizzle-orm';
import { CustomError } from '../errors';
import db from '../models';
import {
  PermissionInsert,
  PermissionSchema,
  PermissionSelect
} from '../models/schema';

class PermissionService {
  public static async createOne(
    data: Pick<PermissionInsert, 'module_id'>,
    role_id: string
  ) {
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
}

export default PermissionService;
