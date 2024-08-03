import { and, eq, ne } from 'drizzle-orm';
import db from '../models';
import {
  UserInsert,
  UserSchema,
  UserSelect,
  DetailedUser
} from '../models/schema';
import { CustomError, NotFoundError } from '../errors';
import { toTitleCase } from '../utils';

class UserService {
  public static async createOne(
    data: UserInsert
  ): Promise<Omit<UserSelect, 'password'>> {
    const [user] = await db
      .insert(UserSchema)
      .values({ ...data, email: data.email.toLowerCase() })
      .returning();

    if (!user) {
      throw new CustomError('Database error: User returned as undefined', 500);
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  public static async findOne(
    data: Partial<UserSelect>
  ): Promise<DetailedUser | undefined> {
    const keys = Object.keys(data) as Array<keyof Partial<UserSelect>>;
    const values = Object.values(data) as Array<any>;
    const user = await db.query.UserSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(UserSchema[key], values[index]))
      ),
      with: {
        role: {
          columns: {
            name: true
          },
          with: {
            permission: {
              columns: {
                role_id: false,
                createdAt: false,
                updatedAt: false,
                module_id: false
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
                        name: true
                      }
                    }
                  }
                },
                module: {
                  columns: {
                    name: true,
                    id: true,
                    icon: true
                  }
                }
              }
            }
          }
        }
      }
    });
    user?.role?.permission.map((permission) => {
      permission.module.name = toTitleCase(permission.module.name);
      permission.permissionAction.map((action) => {
        action.action.name = toTitleCase(action.action.name);
        return action;
      });
      return permission;
    });
    return user;
  }

  public static async readAll(
    reqUserId: string
  ): Promise<Omit<DetailedUser, 'password'>[]> {
    return db.query.UserSchema.findMany({
      where: ne(UserSchema.id, reqUserId),
      columns: {
        password: false
      },
      with: {
        role: {
          columns: {
            name: true
          },
          with: {
            permission: {
              columns: {
                role_id: false,
                createdAt: false,
                updatedAt: false,
                module_id: false
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
                        name: true
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
        }
      }
    });
  }

  public static async updateUser(
    userId: UserSelect['id'],
    data: Partial<UserInsert>
  ): Promise<Omit<UserSelect, 'password'>> {
    const [user] = await db
      .update(UserSchema)
      .set(data)
      .where(eq(UserSchema.id, userId))
      .returning();

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  public static async deleteUser(
    userId: UserSelect['id']
  ): Promise<Omit<UserSelect, 'password'>> {
    const [user] = await db
      .delete(UserSchema)
      .where(eq(UserSchema.id, userId))
      .returning();

    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  public static async updateRole(
    users: UserSelect['id'][],
    role_id: string
  ): Promise<DetailedUser['id'][]> {
    const userIds = users.map(async (user_id) => {
      const { id } = await this.updateUser(user_id, { role_id });

      return id;
    });

    return Promise.all(userIds).then((res) => res);
  }
}

export default UserService;
