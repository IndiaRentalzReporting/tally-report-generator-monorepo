import { eq } from 'drizzle-orm';
import { db } from '../models';
import { UserInsert, UserSchema, UserSelect } from '../models/schema';
import AuthService from './AuthService';

class CustomerService {
  public static async createOne(
    data: UserInsert
  ): Promise<UserSelect | undefined> {
    try {
      const [customer] = await db
        .insert(UserSchema)
        .values({
          ...data,
          password: await AuthService.hashPassword(data.password)
        })
        .returning();
      return customer;
    } catch (err) {
      console.error('Could not create a new User!');
      throw err;
    }
  }

  public static async findOne(
    data: Record<'email', string>
  ): Promise<UserSelect | undefined> {
    const customer = await db.query.UserSchema.findFirst({
      where: eq(UserSchema.email, data.email)
    });

    return customer;
  }

  public static updateOne() {}
}

export default CustomerService;
