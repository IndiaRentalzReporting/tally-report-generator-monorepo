import { BaseServiceNew } from '@trg_package/base-service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { UserSchema } from '../schemas';
import * as dashboardSchemas from '../schemas';
import { DetailedUser } from '../types';

export class UserService extends BaseServiceNew<
  typeof dashboardSchemas,
  typeof UserSchema
> {
  constructor(db: PostgresJsDatabase<typeof dashboardSchemas>) {
    super(db, UserSchema, db.query.UserSchema);
  }

  public async findMany(data: Partial<typeof this.schema.$inferSelect> = {}) {
    const users = await super.findMany(data, {
      with: {
        role: {
          with: {
            permission: {
              with: {
                permissionAction: {
                  with: {
                    action: true
                  }
                },
                module: true
              }
            }
          }
        }
      }
    });

    return users;
  }

  public async findOne(
    data: Partial<typeof this.schema.$inferSelect>
  ): Promise<DetailedUser> {
    const user = (await super.findOne(data, {
      with: {
        role: {
          with: {
            permission: {
              with: {
                permissionAction: {
                  with: {
                    action: true
                  }
                },
                module: true
              }
            }
          }
        }
      }
    })) as DetailedUser;

    return user;
  }
}
