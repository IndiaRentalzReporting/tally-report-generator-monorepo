import db from '../models';
import { UserSchema, UserSelect, DetailedUser } from '../models/schema';
import { toTitleCase } from '../utils';
import BaseService from './BaseService';

class UserService extends BaseService<
  typeof UserSchema,
  typeof db.query.UserSchema
> {
  constructor() {
    super(UserSchema, db.query.UserSchema);
  }

  public async findOneDetailedUser(
    data: Partial<typeof this.schema.$inferSelect>
  ): Promise<NonNullable<ReturnType<typeof this.tableName.findFirst>>> {
    return super.findOne(data, {
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
    });
  }

  public prettifyUser(user: DetailedUser): DetailedUser {
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

  public async updateRole(
    users: UserSelect['id'][],
    role_id: string
  ): Promise<DetailedUser['id'][]> {
    const userIds = users.map(async (user_id) => {
      const { id } = await this.updateOne(user_id, { role_id });

      return id;
    });

    return Promise.all(userIds).then((res) => res);
  }
}

const USI = new UserService();

export default USI;
