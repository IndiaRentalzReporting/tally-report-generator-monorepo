import { BaseServiceNew } from '@trg_package/base-service';
import { UserSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';
import { hashPassword, toTitleCase } from '@trg_package/utils';
import { UserInsert, UserSelect } from '../schemas/users';
import { DetailedUser } from '../types';

export class UserService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof UserSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, UserSchema, db.query.UserSchema);
  }

  public async createOne(data: UserInsert): Promise<UserSelect> {
    const user = await super.createOne({
      ...data,
      password: await hashPassword(data.password)
    });
    return user;
  }

  public async findOneDetailedUser(
    data: Partial<typeof this.schema.$inferSelect>
  ): Promise<DetailedUser> {
    const user = (await super.findOne(data, {
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
    })) as unknown as DetailedUser;
    const prettyUser = this.prettifyUser(user);
    return prettyUser;
  }

  private prettifyUser(user: DetailedUser): DetailedUser {
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
}
