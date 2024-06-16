import { and, eq, ne } from 'drizzle-orm';
import db from '../models';
import {
  UserInsert,
  UserSchema,
  UserSelect,
  UserWithRole
} from '../models/schema';
import { CustomError } from '../errors';

class UserService {
  public static async createOne(data: UserInsert): Promise<UserSelect> {
    try {
      const [user] = await db.insert(UserSchema).values(data).returning();
      if (!user) {
        throw new CustomError(
          'Database error: User returned as undefined',
          500
        );
      }
      return user;
    } catch (err) {
      console.error('Could not create a new User!');
      throw err;
    }
  }

  public static async findOne(
    data: Partial<UserSelect>
  ): Promise<UserWithRole | undefined> {
    const keys = Object.keys(data) as Array<keyof Partial<UserSelect>>;
    const values = Object.values(data) as Array<any>;
    return db.query.UserSchema.findFirst({
      where: and(
        ...keys.map((key, index) => eq(UserSchema[key], values[index]))
      ),
      with: {
        role: {
          columns: {
            name: true
          }
        }
      }
    });
  }

  public static async getAll(reqUserId: string): Promise<UserWithRole[]> {
    return db.query.UserSchema.findMany({
      where: ne(UserSchema.id, reqUserId),
      with: {
        role: {
          columns: {
            name: true
          }
        }
      }
    });
  }

  public static async updateUser(
    userId: UserSelect['id'],
    data: Partial<UserInsert>
  ): Promise<UserSelect> {
    const [user] = await db
      .update(UserSchema)
      .set(data)
      .where(eq(UserSchema.id, userId))
      .returning();

    if (!user) {
      throw new CustomError('Database error: User does not exist', 500);
    }

    return user;
  }

  public static async assignRole(
    users: UserSelect['id'][],
    role_id: string
  ): Promise<UserWithRole['id'][]> {
    const userIds = users.map(async (user_id) => {
      const { id } = await this.updateUser(user_id, { role_id });

      return id;
    });

    return Promise.all(userIds).then((res) => res);
  }
}

export default UserService;
