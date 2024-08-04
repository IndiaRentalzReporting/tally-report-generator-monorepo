import { and, eq } from 'drizzle-orm';
import { CustomError, NotFoundError } from '../errors';
import db from '../models';
import {
  ActionSchema,
  ActionSelect,
  DetailedPermission,
  PermissionActionSelect,
  PermissionInsert,
  PermissionSchema,
  PermissionSelect
} from '../models/schema';
import PermissionActionService from './PermissionActionService';
import RoleService from './RoleService';
import config from '../config';
import BaseService from './BaseService';

const ActionService = new BaseService(ActionSchema, db.query.ActionSchema);
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

  public static async findAll(): Promise<DetailedPermission[]> {
    return db.query.PermissionSchema.findMany({
      with: {
        module: {
          columns: {
            name: true,
            id: true
          }
        },
        permissionAction: {
          columns: {
            action_id: false,
            permission_id: false
          },
          with: {
            action: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        },
        role: {
          columns: {
            name: true,
            id: true
          }
        }
      }
    });
  }

  public static async findMany(
    data: Partial<PermissionSelect>
  ): Promise<DetailedPermission[]> {
    const keys = Object.keys(data) as Array<keyof Partial<PermissionSelect>>;
    const values = Object.values(data) as Array<any>;

    const permission = await db.query.PermissionSchema.findMany({
      where: and(
        ...keys.map((key, index) => eq(PermissionSchema[key], values[index]))
      ),
      with: {
        module: {
          columns: {
            name: true,
            id: true
          }
        },
        permissionAction: {
          columns: {
            action_id: false,
            permission_id: false
          },
          with: {
            action: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        },
        role: {
          columns: {
            name: true,
            id: true
          }
        }
      }
    });

    return permission;
  }

  public static async findOne(
    data: Partial<PermissionSelect>
  ): Promise<DetailedPermission> {
    const keys = Object.keys(data) as Array<keyof Partial<PermissionSelect>>;
    const values = Object.values(data) as Array<any>;

    const permission = await db.query.PermissionSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(PermissionSchema[key], values[index]))
      ),
      with: {
        module: {
          columns: {
            name: true,
            id: true
          }
        },
        permissionAction: {
          columns: {
            action_id: false,
            permission_id: false
          },
          with: {
            action: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        },
        role: {
          columns: {
            name: true,
            id: true
          }
        }
      }
    });

    if (!permission) {
      throw new NotFoundError('Permission does not exists');
    }

    return permission;
  }

  public static async assignAction(data: {
    permission_id: PermissionSelect['id'];
    action_id: ActionSelect['id'];
  }): Promise<PermissionActionSelect> {
    return PermissionActionService.createOne({ ...data });
  }

  public static async deleteOne(id: PermissionSelect['id']): Promise<void> {
    await db.delete(PermissionSchema).where(eq(PermissionSchema.id, id));
  }

  public static async extendSuperuserActions(action_id: string) {
    const { id: role_id } = await RoleService.findOne({
      name: config.app.SUPER_USER_NAME
    });
    const permissions = await PermissionService.findMany({ role_id });

    console.log({
      role_id,
      permissions
    });

    const promises = permissions.map(async ({ id: permission_id }) =>
      this.assignAction({ permission_id, action_id })
    );

    await Promise.all(promises);
  }

  public static async extendSuperuserModules(module_id: string) {
    const { id: role_id } = await RoleService.findOne({
      name: config.app.SUPER_USER_NAME
    });
    const { id: permission_id } = await PermissionService.createOne({
      module_id,
      role_id
    });

    const actions = await ActionService.findAll();

    const promises = actions.map(({ id: action_id }) =>
      this.assignAction({ permission_id, action_id })
    );

    await Promise.all(promises);
  }
}

export default PermissionService;
