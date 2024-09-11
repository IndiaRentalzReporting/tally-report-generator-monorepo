import { BaseServiceNew } from '@trg_package/base-service';
import { UserSchema } from '../schemas';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dashboardSchemas from '../schemas';
import { hashPassword } from '@trg_package/utils';
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

  public async findMany(data: Partial<typeof this.schema.$inferSelect> = {}) {
    const users = await super.findMany(data, {
      with: {
        role: {
          columns: {
            //@ts-ignore
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

    return users;
  }

  public async findOneDetailedUser(
    data: Partial<typeof this.schema.$inferSelect>
  ): Promise<DetailedUser> {
    const user = await super.findOne(data, {
      with: {
        role: {
          columns: {
            //@ts-ignore
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

    return user as DetailedUser;
  }
}
