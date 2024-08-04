import { and, eq } from 'drizzle-orm';
import { CustomError, NotFoundError } from '../errors';
import db from '../models';
import {
  DetailedRole,
  RoleInsert,
  RoleSchema,
  RoleSelect
} from '../models/schema';

class RoleService {
  public static async readAll(): Promise<RoleSelect[]> {
    return db.query.RoleSchema.findMany({
      with: {
        permission: {
          columns: {
            id: true
          }
        }
      }
    });
  }

  public static async findOne(
    data: Partial<RoleSelect>
  ): Promise<DetailedRole> {
    const keys = Object.keys(data) as Array<keyof Partial<RoleSelect>>;
    const values = Object.values(data) as Array<any>;
    const role = await db.query.RoleSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(RoleSchema[key], values[index]))
      ),
      with: {
        permission: {
          columns: {
            module_id: false,
            updatedAt: false,
            role_id: false,
            createdAt: false,

            id: false
          },
          with: {
            permissionAction: {
              columns: {
                permission_id: false,
                action_id: false
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
            module: {
              columns: {
                name: true,
                id: true
              }
            }
          }
        }
      }
    });

    if (!role) throw new NotFoundError('Role does not exist');

    return role;
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

  public static async updateOne(
    roleId: RoleSelect['id'],
    data: Partial<RoleSelect>
  ): Promise<RoleSelect> {
    const [role] = await db
      .update(RoleSchema)
      .set({ ...data, name: data.name?.toLowerCase() })
      .where(eq(RoleSchema.id, roleId))
      .returning();

    if (!role) throw new NotFoundError('Role does not exist');

    return role;
  }

  public static async deleteOne(roleId: RoleSelect['id']): Promise<RoleSelect> {
    const [role] = await db
      .delete(RoleSchema)
      .where(eq(RoleSchema.id, roleId))
      .returning();

    if (!role) throw new NotFoundError('Role does not exist');

    return role;
  }
}

export default RoleService;
