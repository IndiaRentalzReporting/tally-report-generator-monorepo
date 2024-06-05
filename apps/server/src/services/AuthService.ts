import bcrypt from 'bcrypt';
import { BadRequestError, CustomError, NotFoundError } from '../errors';
import { UserInsert, UserSchema, UserSelect } from '../models/schema';
import { db } from '../models';
import CustomerService from './CustomerService';

class AuthService {
  public static async register(
    data: UserInsert
  ): Promise<UserSelect | undefined> {
    const doesUserAlreadyExists = await CustomerService.findOne({
      email: data.email
    });

    if (doesUserAlreadyExists != null) {
      throw new CustomError('User Already Exists', 409);
    }
    const customer = await db
      .insert(UserSchema)
      .values({
        ...data,
        password: await this.hashPassword(data.password)
      })
      .returning();

    return customer[0];
  }

  public static async login(data: Pick<UserInsert, 'email' | 'password'>) {
    const { email, password } = data;
    const customer = await CustomerService.findOne({ email });

    if (customer === undefined) {
      throw new NotFoundError('User does not exist');
    }

    const passwordMatch = await this.comparePassword(
      password,
      customer?.password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Wrong Password');
    }

    console.log({ passwordMatch, customer });
    return customer;
  }

  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }

  public static async comparePassword(
    password: string,
    hash: string
  ): Promise<boolean> {
    const doesPasswordMatch = await bcrypt.compare(password, hash);
    return doesPasswordMatch;
  }
}

export default AuthService;
