import db from '../models';
import { UserSelect, DetailedUser } from '@trg_package/dashboard-schemas/types';
import { toTitleCase } from '@trg_package/utils';
import { UserService as BaseUserService } from '@trg_package/dashboard-schemas/services';

class UserService extends BaseUserService {
  constructor() {
    super(db);
  }

  public async findOneDetailedUser(
    data: Partial<typeof this.schema.$inferSelect>
  ) {
    return super.findOne(data, {
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
