import { eq, ne } from 'drizzle-orm';
import { db } from '../models';
import {
  UserInsert,
  UserRoleSchema,
  UserRoleSelect,
  UserSchema,
  UserSelect
} from '../models/schema';
import { CustomError } from '../errors';

class UserService {
  public static async createOne(data: UserInsert): Promise<UserSelect> {
    try {
      const [user] = await db.insert(UserSchema).values(data).returning();
      console.log({ user });
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
    data: Record<'email', string>
  ): Promise<UserSelect | undefined> {
    const user = await db.query.UserSchema.findFirst({
      where: eq(UserSchema.email, data.email)
    });

    return user;
  }

  public static async getAll(reqUserId: string): Promise<UserSelect[]> {
    return db.query.UserSchema.findMany({
      where: ne(UserSchema.id, reqUserId)
    });
  }

  public static async assignRole(
    userId: string,
    roleId: string
  ): Promise<UserRoleSelect> {
    const [relation] = await db
      .insert(UserRoleSchema)
      .values({
        user_id: userId,
        role_id: roleId
      })
      .returning();

    if (!relation) {
      throw new CustomError(
        'Database error: Relation returned as undefined',
        500
      );
    }

    return relation;
  }
}

export default UserService;
